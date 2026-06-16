module.exports = async (req, res) => {
  const { rating, session } = req.query;

  if (rating && process.env.RESEND_API_KEY) {
    const stars = "⭐".repeat(Number(rating) || 0);
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Snabbrev <hej@snabbrev.se>",
        to: ["hej@snabbrev.se"],
        subject: `Nytt betyg: ${rating}/5 ${stars}`,
        text: `En kund gav betyget ${rating}/5 ${stars}\nSession: ${session || "okänd"}`,
      }),
    }).catch(err => console.error("Feedback notification failed:", err));
  }

  res.setHeader("Location", `/tack-feedback?rating=${encodeURIComponent(rating || "")}`)
  res.status(302).end();
};
