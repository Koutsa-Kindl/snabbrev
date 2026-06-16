const Stripe = require("stripe");
const Anthropic = require("@anthropic-ai/sdk");

// Retry wrapper: retries up to `retries` times with linear backoff
async function withRetry(fn, retries = 3, delayMs = 2000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "session_id krävs" });

  // Free session (KINDL100) — no Stripe verification needed
  let jobTitle, company, jobDescription, background, email, linkedinData, companyInfo, isUpsell;

  if (session_id.startsWith("free_")) {
    try {
      const decoded = JSON.parse(Buffer.from(session_id.slice(5), "base64url").toString());
      ({ jobTitle, company, jobDescription, background, email } = decoded);
      isUpsell = false;
    } catch {
      return res.status(400).json({ error: "Ogiltig session." });
    }
  } else {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== "paid") {
        return res.status(402).json({ error: "Betalning ej genomförd." });
      }

      ({ linkedinData, background, email, companyInfo } = session.metadata);
      jobTitle = session.metadata.jobTitle;
      company = session.metadata.company;
      isUpsell = session.metadata.isUpsell === "true";

      // Reassemble jobDescription — split across jobDesc1/2/3, old sessions used jobDescription
      jobDescription = session.metadata.jobDesc1 !== undefined
        ? (session.metadata.jobDesc1 || "") + (session.metadata.jobDesc2 || "") + (session.metadata.jobDesc3 || "")
        : (session.metadata.jobDescription || "");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Kunde inte verifiera betalning." });
    }
  }

  try {

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Step 1: Analyze the job listing for ATS keywords and tone
    const analysisMsg = await withRetry(() => anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Analysera denna jobbannons och returnera BARA ett JSON-objekt (inget annat):
{
  "keywords": ["nyckelord1", "nyckelord2", ...],
  "tone": "formal|casual|startup|corporate",
  "keyRequirements": ["krav1", "krav2", ...],
  "companyVibe": "kort beskrivning av företagskulturen baserat på annonsen"
}

Jobbannons:
${jobDescription}`,
      }],
    }));

    let analysis = { keywords: [], tone: "professional", keyRequirements: [], companyVibe: "" };
    try {
      const raw = analysisMsg.content[0].text.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(raw);
    } catch {}

    // Step 2: Generate the letter with full context
    const linkedinSection = linkedinData
      ? `\nSökandens LinkedIn-profil:\n${linkedinData}`
      : `\nSökandens bakgrund:\n${background || "Ej angiven"}`;

    const companySection = companyInfo
      ? `\nFöretagsinformation (från deras webbplats):\n${companyInfo}`
      : "";


    const prompt = isUpsell
      ? `Du är en expert på rekrytering och CV-optimering. Analysera detta CV mot jobbannonsen och ge konkret, specifik feedback på svenska.

TJÄNST: ${jobTitle}
FÖRETAG: ${company}
JOBBANNONS/KONTEXT: ${jobDescription}

CV:
${background || "Ej angivet"}

INSTRUKTIONER:
Ge feedback i dessa tre delar — var specifik, inte generell:

1. STYRKOR (2-3 punkter)
Vad i CV:t matchar jobbet bra? Lyft fram konkreta saker.

2. SAKNAS / KAN STÄRKAS (3-4 punkter)
Vad efterfrågas i jobbannonsen som inte syns i CV:t? Vilka nyckelord bör läggas till? Vad bör förtydligas?

3. REKOMMENDATIONER (2-3 punkter)
Konkreta åtgärder: exakt vad ska läggas till, ändras eller omformuleras för att CV:t ska passa bättre.

Skriv BARA feedbacken, inga inledningar eller avslutningar.`
      : `Du är en expert på att skriva personliga brev på svenska som faktiskt leder till intervjuer.

TJÄNST: ${jobTitle}
FÖRETAG: ${company}

JOBBANNONS:
${jobDescription}

${linkedinSection}
${companySection}

ANALYS AV JOBBANNONSEN:
- Ton/kultur: ${analysis.tone}
- Företagskänsla: ${analysis.companyVibe}
- ATS-nyckelord att inkludera naturligt: ${analysis.keywords.join(", ")}
- Viktigaste krav: ${analysis.keyRequirements.join(", ")}

INSTRUKTIONER:
1. Skriv på svenska, matcha brevets ton till företagskulturen (${analysis.tone})
2. Inled med en stark, unik öppningsmening — ALDRIG "Härmed söker jag" eller "Jag skriver angående"
3. Koppla sökandens specifika erfarenheter till jobbannonsens krav med konkreta exempel
4. Inkludera dessa nyckelord naturligt i texten: ${analysis.keywords.slice(0, 6).join(", ")}
5. Referera specifikt till ${company} — visa att du förstår vad de gör och varför du vill jobba just där
6. 3-4 stycken, max en A4-sida
7. Avsluta med tydlig CTA för intervju
8. Börja med "Hej," eller "Till rekryteringsansvarig," — skriv sedan BARA brevet, inga förklaringar

VIKTIGT: Brevet ska kännas genuint och mänskligt skrivet, inte som en mall. Varje mening ska ha ett syfte.`;

    const letterMsg = await withRetry(() => anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }));

    const letter = letterMsg.content[0].text;

    // Step 3: Send email directly via Resend (inline — self-referencing fetch unreliable in Vercel)
    if (email && email.includes("@") && process.env.RESEND_API_KEY) {
      const html = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><style>
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f9f8f6;margin:0;padding:40px 20px}
        .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e3de;overflow:hidden}
        .header{background:#2d6a4f;padding:24px 32px;color:#fff}
        .header h1{font-size:18px;margin:0;font-weight:600}
        .header p{margin:4px 0 0;font-size:13px;opacity:.8}
        .body{padding:32px;font-size:15px;line-height:1.8;color:#1a1a18;white-space:pre-wrap;font-family:Georgia,serif}
        .footer{padding:20px 32px;border-top:1px solid #e5e3de;font-size:12px;color:#6b6963;text-align:center}
      </style></head><body>
      <div class="wrap">
        <div class="header"><h1>Ditt personliga brev</h1><p>${jobTitle} · ${company}</p></div>
        <div class="body">${letter.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
        <div class="footer">Snabbrev.se · Genererat med Claude AI</div>
      </div></body></html>`;

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Snabbrev <hej@snabbrev.se>",
          to: [email],
          subject: `Ditt personliga brev — ${jobTitle} på ${company}`,
          html,
          text: letter,
        }),
      }).catch(err => console.error("Email send failed:", err));

      // Schedule satisfaction email 2 hours later
      const scheduledAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const sessionParam = encodeURIComponent(session_id);
      const baseUrl = "https://www.snabbrev.se";
      const satisfactionHtml = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><style>
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f9f8f6;margin:0;padding:40px 20px}
        .wrap{max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e3de;overflow:hidden}
        .header{background:#2d6a4f;padding:24px 32px;color:#fff}
        .header h1{font-size:17px;margin:0;font-weight:600}
        .body{padding:32px;font-size:15px;line-height:1.8;color:#1a1a18;text-align:center}
        .stars{display:flex;justify-content:center;gap:12px;margin:28px 0}
        .star{display:inline-block;text-decoration:none;font-size:32px;line-height:1;transition:transform .1s}
        .label{font-size:12px;color:#6b6963;margin-top:-12px;margin-bottom:24px}
        .share{font-size:13px;color:#6b6963;border-top:1px solid #e5e3de;padding-top:20px;margin-top:8px}
        .share a{color:#2d6a4f;font-weight:600;text-decoration:none}
        .footer{padding:16px 32px;font-size:11px;color:#6b6963;text-align:center;border-top:1px solid #e5e3de}
      </style></head><body>
      <div class="wrap">
        <div class="header"><h1>Hur gick det med ansökan?</h1></div>
        <div class="body">
          <p>Hej! Vi hoppas att ditt personliga brev till <strong>${company}</strong> landade bra.<br>Hur nöjd är du med resultatet?</p>
          <div class="stars">
            <a class="star" href="${baseUrl}/api/feedback?rating=1&session=${sessionParam}" title="Dåligt">⭐</a>
            <a class="star" href="${baseUrl}/api/feedback?rating=2&session=${sessionParam}" title="Under förväntan">⭐⭐</a>
            <a class="star" href="${baseUrl}/api/feedback?rating=3&session=${sessionParam}" title="OK">⭐⭐⭐</a>
            <a class="star" href="${baseUrl}/api/feedback?rating=4&session=${sessionParam}" title="Bra">⭐⭐⭐⭐</a>
            <a class="star" href="${baseUrl}/api/feedback?rating=5&session=${sessionParam}" title="Perfekt">⭐⭐⭐⭐⭐</a>
          </div>
          <p class="label">Klicka på antalet stjärnor som stämmer</p>
          <div class="share">Nöjd? Tipsa en vän — <a href="https://www.snabbrev.se">snabbrev.se</a> · 49 kr, klart på 30 sekunder.</div>
        </div>
        <div class="footer">Snabbrev.se · Du får det här mailet eftersom du nyligen genererade ett brev hos oss.</div>
      </div></body></html>`;

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Snabbrev <hej@snabbrev.se>",
          to: [email],
          subject: `Hur gick det med ansökan till ${company}? ⭐`,
          html: satisfactionHtml,
          scheduled_at: scheduledAt,
        }),
      }).catch(err => console.error("Satisfaction email schedule failed:", err));
    }

    res.json({
      letter,
      jobTitle,
      company,
      keywords: analysis.keywords,
      emailSent: !!email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Något gick fel vid generering av brevet. Kontakta hej@snabbrev.se med din order så löser vi det." });
  }
};
