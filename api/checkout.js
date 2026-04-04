const Stripe = require("stripe");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const {
      projectDescription,
      serviceType,
      specialty,
      budget,
      tone,
      clientName,
      clientIndustry,
      yourName,
      email,
      plan, // "single" ($5) or "pro" ($29/mo)
    } = req.body;

    if (!projectDescription || projectDescription.trim().length < 20) {
      return res.status(400).json({ error: "Please describe your project in at least 20 characters." });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const isPro = plan === "pro";

    const desc = projectDescription || "";
    const sessionConfig = {
      payment_method_types: ["card"],
      customer_email: email || undefined,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/generate`,
      metadata: {
        serviceType: (serviceType || "").slice(0, 499),
        specialty: (specialty || "").slice(0, 499),
        budget: (budget || "").slice(0, 499),
        tone: (tone || "professional").slice(0, 499),
        clientName: (clientName || "").slice(0, 499),
        clientIndustry: (clientIndustry || "").slice(0, 499),
        yourName: (yourName || "").slice(0, 499),
        email: (email || "").slice(0, 499),
        // Split project description across 3 keys (500 chars each = ~1470 chars total)
        projDesc1: desc.slice(0, 490),
        projDesc2: desc.slice(490, 980),
        projDesc3: desc.slice(980, 1470),
        plan: isPro ? "pro" : "single",
      },
    };

    if (isPro) {
      // Subscription: $29/month
      sessionConfig.mode = "subscription";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ScopeAI Pro",
              description: "Unlimited AI proposals, PDF export, tone options",
            },
            unit_amount: 2900,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ];
    } else {
      // Pay-per-use: $5
      sessionConfig.mode = "payment";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ScopeAI Proposal",
              description: "Professional AI-generated client proposal (PDF ready)",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Could not create checkout session: " + err.message });
  }
};
