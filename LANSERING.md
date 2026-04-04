# Snabbrev — Lanseringstexter

## PRODUCT HUNT

**Tagline:**
AI-written cover letters in 30 seconds — ATS-optimized, LinkedIn-matched, 49 SEK

**Description:**
Snabbrev analyzes your LinkedIn profile + the job listing and writes a tailored, ATS-optimized cover letter in 30 seconds.

No subscription. No account. One-time payment of 49 SEK (~$4.50).

What makes it different:
→ Pastes in the job URL — fetches the listing automatically
→ Extracts ATS keywords and weaves them in naturally
→ Matches your actual LinkedIn experience to the job requirements
→ Delivers the letter to your email
→ Remembers your profile for next time (localStorage)

Built in a weekend. Already live at snabbrev.se.

**First comment:**
Hey PH! I built this because I kept seeing friends spend hours on cover letters that got filtered out by ATS before anyone read them.

The insight: most cover letter tools give you a generic template. Snabbrev reads the actual job listing, extracts the keywords the ATS is looking for, and writes a letter that sounds human but passes the bots.

It's 49 SEK ($4.50) per letter — no subscription. If you hate it, email hej@snabbrev.se and I'll refund you.

Would love your feedback on what's missing.

---

## REDDIT — r/sweden

**Title:** Byggde ett verktyg som skriver personliga brev med AI — snabbrev.se (49 kr, engångspris)

**Text:**
Hej r/sweden,

Jag har byggt snabbrev.se — ett verktyg som skriver ett skräddarsytt personligt brev på 30 sekunder.

Hur det fungerar:
1. Klistra in din LinkedIn-profil (eller beskriv din bakgrund)
2. Klistra in länken till jobbannonsen
3. Betala 49 kr via Stripe
4. Brevet är klart — ATS-optimerat och anpassat till just det jobbet

Varför 49 kr och inte gratis? Jag använder Claude AI (Anthropics modell) som kostar per användning. Men det är engångspris — ingen prenumeration, inget konto.

Vad som skiljer det från ChatGPT: verktyget analyserar jobbannonsen specifikt, extraherar de nyckelord som rekryteringssystem (ATS) letar efter, och väver in dem naturligt. Du ser vilka nyckelord som inkluderades.

Prova gärna och säg vad ni tycker. Är öppen för feedback.

snabbrev.se

---

## REDDIT — r/jobbsverige (om den finns) / r/personalutveckling

**Title:** Personliga brev med AI — ATS-optimerade på 30 sekunder

**Text:**
Vet inte om det är ok att posta såhär men jag har byggt snabbrev.se och tänkte att folk här kanske har nytta av det.

Kortfattat: klistra in jobbannonsen och din LinkedIn-profil, betala 49 kr, få ett personligt brev som är anpassat till just det jobbet och innehåller rätt nyckelord för rekryteringssystem.

Inget konto, ingen prenumeration.

Återkoppla gärna om ni testar det.

---

## INDIE HACKERS

**Title:** I built a $5 AI cover letter tool targeting the Swedish market — here's why

**Body:**
Most AI cover letter tools are either:
a) Free and generic (ChatGPT wrapper with no job-specific analysis)
b) Subscription-based SaaS with way more features than anyone needs

I built Snabbrev as a third option: a one-time payment, single-purpose tool that does one thing well.

**What it does:**
- Fetches the job listing from a URL automatically
- Extracts ATS keywords from the listing
- Matches those against the user's LinkedIn profile
- Writes a tailored cover letter with the keywords woven in naturally
- Delivers it via email

**Why Swedish market:**
Swedish jobseekers are underserved. Most AI tools are English-first. The main Swedish competitors (Genzee.ai, SvenskaCV.se) require subscriptions and accounts. Snabbrev is 49 SEK (~$4.50), no account, no subscription.

**Stack:** Vanilla HTML/CSS/JS, Vercel serverless functions, Stripe, Anthropic Claude API. Zero framework overhead. Total hosting cost: $0/month.

**Economics:**
- Price: 49 SEK
- Stripe fee: ~1.50 SEK  
- Claude API cost: ~0.15 SEK
- Profit per letter: ~47 SEK (~$4.50)

Break-even: 3 sales (covers domain).

Live at snabbrev.se — launched today. Would love feedback from anyone who's built similar micro-SaaS.

---

## GOOGLE SEARCH CONSOLE — Submit these URLs after uploading

Submit these to Google Search Console for faster indexing:
- https://snabbrev.se/
- https://snabbrev.se/sitemap.xml
- https://snabbrev.se/blogg/hur-skriver-man-personligt-brev
- https://snabbrev.se/blogg/ats-vad-ar-det

Go to: search.google.com/search-console
Add property → URL prefix → https://snabbrev.se
Verify via HTML tag (add to index.html <head>) or DNS TXT record in Cloudflare.
