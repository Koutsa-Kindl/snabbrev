const Stripe = require("stripe");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { jobTitle, company, jobDescription, background, email, discountAmount, discountCode, isUpsell } = req.body;

    if (!jobTitle || !company || !jobDescription) {
      return res.status(400).json({ error: "Tjänst, företag och jobbeskrivning krävs." });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    // 100% discount — bypass Stripe entirely
    if ((discountCode || "").toUpperCase() === "KINDL100") {
      const payload = Buffer.from(JSON.stringify({
        jobTitle, company, jobDescription, background, email,
      })).toString("base64url");
      return res.json({ url: `${origin}/success?free_session=${payload}` });
    }

    // Pricing logic
    let basePrice = isUpsell ? 2900 : 4900; // öre
    const discount = Math.min(parseInt(discountAmount)||0, 20) * 100;
    const finalPrice = Math.max(basePrice - discount, 1900); // min 19kr

    const productName = isUpsell
      ? `CV-granskning – ${jobTitle} på ${company}`
      : `Personligt brev – ${jobTitle} på ${company}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: "sek",
          product_data: { name: productName },
          unit_amount: finalPrice,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        jobTitle: (jobTitle||"").slice(0,499),
        company: (company||"").slice(0,499),
        // Split jobDescription across three keys to overcome Stripe's 500-char limit per value (~1470 chars total)
        jobDesc1: (jobDescription||"").slice(0, 490),
        jobDesc2: (jobDescription||"").slice(490, 980),
        jobDesc3: (jobDescription||"").slice(980, 1470),
        background: (background||"").slice(0,499),
        email: (email||"").slice(0,499),
        isUpsell: isUpsell ? "true" : "false",
      },
      locale: "sv",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
