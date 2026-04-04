module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url krävs" });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });

    const html = await response.text();

    // Extract JSON-LD structured data LinkedIn embeds for SEO
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    let structured = null;
    if (jsonLdMatch) {
      try { structured = JSON.parse(jsonLdMatch[1]); } catch {}
    }

    // Extract meta tags
    const getName = (h) => {
      const m = h.match(/<meta property="og:title" content="([^"]+)"/);
      return m ? m[1].replace(" | LinkedIn", "").trim() : null;
    };
    const getDescription = (h) => {
      const m = h.match(/<meta property="og:description" content="([^"]+)"/);
      return m ? m[1] : null;
    };
    const getTitle = (h) => {
      const m = h.match(/<title>([^<]+)<\/title>/);
      return m ? m[1].replace(" | LinkedIn", "").trim() : null;
    };

    // Strip all HTML for raw text extraction
    const plainText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    const name = structured?.name || getName(html) || getTitle(html) || null;
    const description = structured?.description || getDescription(html) || null;

    // If LinkedIn blocked us (requires login), return graceful fallback
    if (html.includes("authwall") || html.includes("login") && !name) {
      return res.json({
        blocked: true,
        message: "LinkedIn kräver inloggning. Klistra in din profil-text manuellt nedan.",
      });
    }

    // Extract relevant profile sections from plain text
    const profileText = plainText.slice(0, 4000);

    res.json({
      name,
      description,
      profileText,
      structured,
    });
  } catch (err) {
    res.status(500).json({
      blocked: true,
      message: "Kunde inte hämta LinkedIn-profilen. Klistra in din profil-text manuellt.",
    });
  }
};
