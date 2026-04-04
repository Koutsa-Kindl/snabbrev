const Anthropic = require("@anthropic-ai/sdk");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url krävs" });

  try { new URL(url); } catch {
    return res.status(400).json({ error: "Ogiltig URL" });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Snabbrev/1.0)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();

    // Strip markup — keep readable text
    const rawText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 8000); // grab more raw text before Claude filters it

    // Let Claude extract only the relevant job content
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [{
        role: "user",
        content: `Extrahera det väsentliga från denna jobbannons. Returnera BARA en kort, komprimerad text på svenska med:
- Tjänstens huvudsakliga arbetsuppgifter (3-5 punkter)
- Krav och kvalifikationer (3-5 punkter)
- Eventuell info om företagskulturen

Max 400 ord. Inga rubriker, inga onödiga ord. Om texten inte verkar vara en jobbannons, svara bara: "Ingen jobbannons hittades."

Text att analysera:
${rawText}`,
      }],
    });

    const extracted = msg.content[0].text.trim();

    if (extracted === "Ingen jobbannons hittades.") {
      return res.status(422).json({ error: "Kunde inte hitta en jobbannons på sidan. Klistra in texten manuellt." });
    }

    res.json({ text: extracted });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta sidan. Klistra in texten manuellt." });
  }
};
