const Stripe = require("stripe");
const Anthropic = require("@anthropic-ai/sdk");

async function withRetry(fn, retries = 3, delayMs = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
    }
  }
}

const SYSTEM_PROMPT = `You are an expert senior consultant and proposal writer with 15+ years winning high-value B2B contracts worth $5,000 to $250,000. Your proposals are specific, confident, and persuasive — they sound like a seasoned professional who deeply understands the client's business, not a generic AI template.

Generate a professional, client-ready project proposal based on the brief provided. Use the client's industry vocabulary. Be specific — never write filler or generic placeholder text.

Output ONLY the proposal in clean Markdown. No preamble, no explanation, no meta-commentary.

REQUIRED FORMAT (use these exact headings):

## Executive Summary
2-3 sentences: frame the client's specific problem, your solution, and the concrete business outcome they'll get. Reference specific numbers or outcomes where possible.

## Scope of Work
Numbered list of 5-8 specific deliverables. Each item should name the exact output the client receives (e.g., "Figma prototype with 6 screen states" not "Design work").

## What's NOT Included
3-5 bullet points of common scope creep items that are explicitly excluded. Be specific to this project type. This section prevents disputes later.

## Project Timeline
Phase-based breakdown with durations. 3-4 phases. Example: "Phase 1: Discovery & Brief — 3 days"

## Investment

### Essential — $[X]
[Describe what's included in this tier — the minimum viable version]

### Professional — $[X] *(Recommended)*
[Core deliverables + the most valuable additions. This should be the obvious choice.]

### Premium — $[X]
[Everything in Professional + premium extras like rush delivery, extra revisions, or ongoing support]

## Why Work With Us
2-3 sentences. Confident, specific positioning relevant to this type of project. No buzzwords.

## Next Steps
3 bullet points describing exactly what happens after the client says yes. Action-oriented, specific.

PRICING RULES:
- If budget is provided, set Professional tier at that budget, Essential at 65% of it, Premium at 145% of it
- If no budget provided, estimate a fair market rate based on the scope
- Always show USD unless client currency is specified
- Round prices to clean numbers ($4,800 not $4,750)

TONE RULES:
- formal: polished corporate language, third person when referring to your firm
- friendly: warm but professional, conversational, use contractions
- technical: precise technical terminology, emphasis on methodology and specifications`;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type, session_id, projectDescription, serviceType, specialty, budget, tone, clientName, clientIndustry, yourName, isWatermarked } = req.body || {};

  let fields = {};
  let watermark = false;

  if (type === "free") {
    // Free tier — no payment verification
    if (!projectDescription || projectDescription.trim().length < 20) {
      return res.status(400).json({ error: "Please describe your project in at least 20 characters." });
    }
    fields = { projectDescription, serviceType, specialty, budget, tone, clientName, clientIndustry, yourName };
    watermark = true;
  } else if (type === "paid") {
    // Paid tier — verify Stripe session
    if (!session_id) return res.status(400).json({ error: "session_id required." });
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== "paid") {
        return res.status(402).json({ error: "Payment not completed." });
      }
      const m = session.metadata;
      fields = {
        projectDescription: (m.projDesc1 || "") + (m.projDesc2 || "") + (m.projDesc3 || ""),
        serviceType: m.serviceType,
        specialty: m.specialty,
        budget: m.budget,
        tone: m.tone,
        clientName: m.clientName,
        clientIndustry: m.clientIndustry,
        yourName: m.yourName,
      };
      watermark = false;
    } catch (err) {
      console.error("Stripe verification error:", err);
      return res.status(500).json({ error: "Could not verify payment. Email support@scopeai.io with your payment receipt and we'll sort it out immediately." });
    }
  } else {
    return res.status(400).json({ error: "Invalid request type." });
  }

  const { projectDescription: desc, serviceType: svc, specialty: spec, budget: bdg, tone: tn, clientName: cName, clientIndustry: cIndustry, yourName: yName } = fields;

  const userPrompt = `Generate a professional project proposal based on this brief:

PROJECT DESCRIPTION:
${desc}

SERVICE TYPE: ${svc || "Freelance / Consulting"}
SPECIALTY / TECH STACK: ${spec || "Not specified"}
BUDGET / RATE: ${bdg || "To be estimated"}
PREFERRED TONE: ${tn || "professional"}
CLIENT / COMPANY NAME: ${cName || "the client"}
CLIENT INDUSTRY: ${cIndustry || "Not specified"}
FREELANCER / AGENCY NAME: ${yName || "[Your Name]"}`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await withRetry(() =>
      anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      })
    );

    let proposal = msg.content[0].text;

    if (watermark) {
      proposal += "\n\n---\n*Generated with [ScopeAI](https://scopeai.io) — AI proposals for freelancers who win projects.*";
    }

    res.json({ proposal, watermark });
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({
      error: "Proposal generation failed. If you paid, email support@scopeai.io with your payment receipt and we'll generate your proposal manually within 1 hour.",
    });
  }
};
