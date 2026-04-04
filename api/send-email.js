module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, letter, jobTitle, company } = req.body;
  if (!email || !letter) return res.status(400).json({ error: "email och letter krävs" });

  // Skip silently if no Resend key configured — email is optional feature
  if (!process.env.RESEND_API_KEY) {
    return res.json({ sent: false, reason: "no_key" });
  }

  try {
    const html = `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f9f8f6;margin:0;padding:40px 20px}
  .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e3de;overflow:hidden}
  .header{background:#2d6a4f;padding:24px 32px;color:#fff}
  .header h1{font-size:18px;margin:0;font-weight:600}
  .header p{margin:4px 0 0;font-size:13px;opacity:.8}
  .body{padding:32px;font-size:15px;line-height:1.8;color:#1a1a18;white-space:pre-wrap;font-family:Georgia,serif}
  .footer{padding:20px 32px;border-top:1px solid #e5e3de;font-size:12px;color:#6b6963;text-align:center}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <h1>Ditt personliga brev</h1>
    <p>${jobTitle} · ${company}</p>
  </div>
  <div class="body">${letter.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
  <div class="footer">Snabbrev.se · Genererat med Claude AI</div>
</div>
</body></html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Snabbrev <hej@snabbrev.se>",
        to: [email],
        subject: `Ditt personliga brev — ${jobTitle} på ${company}`,
        html,
        text: letter,
      }),
    });

    if (!response.ok) throw new Error(`Resend error: ${response.status}`);
    res.json({ sent: true });
  } catch (err) {
    console.error(err);
    res.json({ sent: false, reason: err.message });
  }
};
