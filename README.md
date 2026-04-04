# Snabbrev 🇸🇪

> AI-genererade personliga brev på 30 sekunder. 39 kr styck.

## Kom igång på 15 minuter

### 1. Skapa konton (gratis)

- **GitHub**: github.com – ladda upp den här mappen som ett nytt repo
- **Vercel**: vercel.com – koppla ditt GitHub-repo, klicka Deploy
- **Stripe**: dashboard.stripe.com – skapa konto, aktivera betalningar

### 2. Hämta dina API-nycklar

**Stripe** → Developers → API keys → kopiera `Secret key` (börjar med `sk_live_`)

**Anthropic** → console.anthropic.com → API Keys → skapa ny nyckel

### 3. Lägg till miljövariabler i Vercel

Vercel Dashboard → ditt projekt → Settings → Environment Variables

```
STRIPE_SECRET_KEY     =  sk_live_...
ANTHROPIC_API_KEY     =  sk-ant-...
```

Klicka Save → gå tillbaka till Deployments → klicka Redeploy.

### 4. Koppla snabbrev.se

Vercel → Settings → Domains → skriv in snabbrev.se
Loopia → DNS → lägg till raden Vercel visar. Klart på 5–30 min.

---

## Ekonomi

| | |
|---|---|
| Pris per brev | 39 kr |
| Stripe-avgift | ~1,50 kr |
| Claude API-kostnad | ~0,15 kr |
| **Din vinst per brev** | **~37 kr** |

10 sålda brev/dag = **~11 000 kr/månaden**

---

## Struktur

```
snabbrev/
├── api/
│   ├── checkout.js   ← skapar Stripe-session
│   └── generate.js   ← verifierar betalning + kallar Claude
├── public/
│   ├── index.html    ← landningssida
│   └── success.html  ← visas efter betalning
├── vercel.json
└── package.json
```
