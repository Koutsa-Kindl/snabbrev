module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url krävs" });

  try {
    new URL(url); // validate
  } catch {
    return res.status(400).json({ error: "Ogiltig URL" });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Snabbrev/1.0)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();

    // Strip tags, scripts, styles — keep readable text
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 3000);

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta sidan. Klistra in texten manuellt." });
  }
};
