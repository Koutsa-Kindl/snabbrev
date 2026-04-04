const Stripe = require("stripe");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).end();

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sessions = await stripe.checkout.sessions.list({ limit: 100, status: "complete" });
    const paid = sessions.data;

    const totalRevenue = paid.reduce((s, x) => s + (x.amount_total || 0), 0) / 100;
    const totalOrders = paid.length;

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const todayPaid = paid.filter(s => s.created * 1000 >= todayStart.getTime());
    const weekPaid = paid.filter(s => s.created * 1000 >= weekStart.getTime());

    res.json({
      totalRevenue,
      totalOrders,
      todayRevenue: todayPaid.reduce((s, x) => s + (x.amount_total || 0), 0) / 100,
      todayOrders: todayPaid.length,
      weekRevenue: weekPaid.reduce((s, x) => s + (x.amount_total || 0), 0) / 100,
      weekOrders: weekPaid.length,
      recentOrders: paid.slice(0, 20).map(s => ({
        amount: (s.amount_total || 0) / 100,
        jobTitle: s.metadata?.jobTitle || "–",
        company: s.metadata?.company || "–",
        email: s.customer_email || "–",
        isUpsell: s.metadata?.isUpsell === "true",
        date: new Date(s.created * 1000).toLocaleString("sv-SE", {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        }),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
