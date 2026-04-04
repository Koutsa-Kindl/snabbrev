const Stripe = require("stripe");
const Anthropic = require("@anthropic-ai/sdk");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "session_id krävs" });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: "Betalning ej genomförd." });
    }

    const {
      jobTitle,
      company,
      jobDescription,
      linkedinData,
      background,
      email,
      companyInfo,
    } = session.metadata;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Step 1: Analyze the job listing for ATS keywords and tone
    const analysisMsg = await anthropic.messages.create({
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
    });

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

    const prompt = `Du är en expert på att skriva personliga brev på svenska som faktiskt leder till intervjuer.

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

    const letterMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const letter = letterMsg.content[0].text;

    // Step 3: Send email if provided (fire and forget)
    if (email && email.includes("@") && process.env.RESEND_API_KEY) {
      fetch(`${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, letter, jobTitle, company }),
      }).catch(() => {});
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
    res.status(500).json({ error: err.message });
  }
};
