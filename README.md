# ScopeAI

> AI-powered project proposal generator for freelancers and consultants. $5 per proposal, $29/month Pro.

## What it does

ScopeAI generates a full, client-ready project proposal from a 2–5 sentence project brief:
- Executive Summary
- Scope of Work (specific deliverables)
- What's NOT Included (scope protection)
- Project Timeline (phase-based)
- Investment (3 pricing tiers: Essential / Professional / Premium)
- Why Work With Us
- Next Steps

Stack: Vanilla HTML/CSS/JS + Vercel serverless functions + Stripe + Claude (Anthropic API)

---

## Deployment Guide

### Step 1: Accounts to create

| Service | Cost | Purpose |
|---|---|---|
| [Vercel](https://vercel.com) | Free | Hosting + serverless functions |
| [Anthropic](https://console.anthropic.com) | ~$0.03/proposal | Claude API for generation |
| [Stripe](https://stripe.com) | 2.9% + $0.30 per txn | Payments |

### Step 2: Set up Stripe products

In the Stripe Dashboard (use **Test mode** first):
1. No products needed — prices are created dynamically in code
2. Note your **Publishable key** and **Secret key**

### Step 3: Deploy to Vercel

```bash
# 1. Fork or clone this repo
git clone https://github.com/YOUR_USERNAME/scopeai
cd scopeai

# 2. Install Vercel CLI
npm i -g vercel

# 3. Deploy
vercel

# Follow prompts — link to your Vercel account
# Set root directory to: . (this folder)
# Framework: Other
```

### Step 4: Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys (use `sk_live_...` for production) |

### Step 5: Custom domain

In Vercel Dashboard → Project → Settings → Domains:
1. Add your domain (e.g., `scopeai.io`)
2. Update DNS records as instructed by Vercel
3. Update these files with your real domain:
   - `public/sitemap.xml` — replace `https://scopeai.io` with your domain
   - `public/robots.txt` — replace `https://scopeai.io/sitemap.xml`
   - All `link rel="canonical"` tags in HTML files

### Step 6: Update placeholder content

Search for and replace these placeholders throughout the codebase:

| Placeholder | Replace with |
|---|---|
| `[YOUR_COMPANY_NAME]` | Your legal entity name |
| `[YOUR_ORG_NUMBER]` | Your company registration number |
| `[YOUR_ADDRESS]` | Your registered address |
| `[YOUR_JURISDICTION]` | Your country/state for governing law |
| `support@scopeai.io` | Your actual support email |
| `https://scopeai.io` | Your actual domain |

---

## File Structure

```
/
├── api/
│   ├── generate.js       # POST — generates proposal via Claude API (free + paid)
│   └── checkout.js       # POST — creates Stripe Checkout session ($5 or $29/mo)
├── public/
│   ├── index.html        # Landing page
│   ├── generate.html     # Proposal form + inline output (free tier)
│   ├── success.html      # Post-payment proposal delivery + upsell + share
│   ├── privacy.html      # GDPR-compliant privacy policy
│   ├── terms.html        # Terms of service
│   ├── sitemap.xml       # SEO sitemap
│   ├── robots.txt        # SEO
│   ├── favicon.svg       # Logo
│   └── blog/
│       ├── freelance-proposal-guide.html    # SEO: "freelance proposal template"
│       └── scope-of-work-template.html      # SEO: "scope of work template"
├── vercel.json           # URL rewrites
└── package.json
```

---

## How the payment flow works

1. User fills form on `/generate`
2. Clicks "Generate — $5" → POST to `/api/checkout` → redirected to Stripe Checkout
3. After payment → Stripe redirects to `/success?session_id=XXX`
4. `/success` page calls `/api/generate` with `{ type: "paid", session_id: "XXX" }`
5. API verifies payment status via Stripe, retrieves form data from Stripe metadata, calls Claude
6. Proposal returned and displayed with copy/PDF options

**Free tier:** Client calls `/api/generate` directly with `{ type: "free", ...formData }`. No Stripe involved. Output includes a watermark.

---

## API cost

- Model: `claude-sonnet-4-20250514`
- ~2,000 tokens in + ~1,200 tokens out per proposal
- Cost: ~$0.024 per proposal at current Sonnet pricing
- Revenue at $5/proposal → ~99% gross margin per generation

---

## Launch checklist

- [ ] All `[PLACEHOLDER]` values replaced
- [ ] Stripe live keys set in Vercel env vars
- [ ] Custom domain configured in Vercel
- [ ] Test a full paid flow in Stripe test mode before going live
- [ ] Swap `sk_test_` to `sk_live_` when ready for production
- [ ] Verify `/privacy` and `/terms` pages are accessible
- [ ] Submit sitemap to Google Search Console
