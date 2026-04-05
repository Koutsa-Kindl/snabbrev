# Cold Bureau — Project Brief for Claude Projects

> This document gives you full context on Cold Bureau so we can work as co-founders.
> Your role: Strategic co-founder, game designer, and business partner.
> My role: Founder/CEO — I make final decisions, you challenge my thinking and help me build something great.

---

## What We're Building

**Cold Bureau** is a daily detective game where players run their own detective agency, interrogate AI-powered suspects using free-form text, and crack murder cases. Think Wordle meets LA Noire meets Duolingo.

**Core experience:**
1. A new murder case drops every day (same for all players globally)
2. You interrogate 3–5 suspects using free text — they respond via Claude (in character)
3. Find the "crack" in someone's story — the logical inconsistency that exposes the killer
4. Submit your accusation — see if you're right
5. Share results, compare with friends, build your streak

**What makes it different:**
- Free-text interrogation (not multiple choice) — feels like real detective work
- Suspects lie, evade, and contradict themselves in believable ways
- Cases are culturally authentic to their location
- A global detective agency you build up over time

---

## The World System — Geographic Bureaus

Players choose a city to found their detective agency. Location matters:

| City | Crime Flavor |
|------|-------------|
| Stockholm, Sweden | Cold, calculated murders; financial crime; organized crime |
| Mexico City, Mexico | Cartel murders, kidnappings, police corruption |
| Tokyo, Japan | Yakuza, honor crimes, corporate espionage |
| Lagos, Nigeria | Fraud syndicates, political murders |
| Naples, Italy | Camorra, port murders, family vendettas |
| Miami, USA | Drug trafficking, white-collar crime |
| Moscow, Russia | Oligarch assassinations, state-sponsored crime |
| London, UK | Aristocratic murders, financial fraud |

Each location generates cases with authentic cultural flavor, local character types, and region-specific crime patterns.

---

## Rank Progression

```
Rank 1–5    Local cases — learn the mechanics
Rank 6–10   Regional cases — serial killers, cross-border crime
Rank 11–15  National assignments — political murders, cover-ups
Rank 16–20  Special assignments (invited) — cartel cases, diplomatic murders, working abroad
Rank 21+    Elite cases — geopolitical murders, UN-level investigations
```

At higher ranks, players get "called in" to cases in other countries. Your reputation travels with you.

---

## The Living World

**Weekly crime waves:** Certain regions have elevated crime activity — players in those bureaus get special event cases.

**Seasonal cases:** Culturally authentic events
- Halloween: Ritual murder in New Orleans (voodoo theme)
- Día de los Muertos: Mexico-specific case
- Lucia murders: Swedish winter noir
- New Year's Eve: Casino heist in Monaco

**Character continuity:** NPCs recur across cases
- The corrupt cop from case 3 shows up again in case 7
- Your local informant occasionally tips you off
- An unknown client sends cryptic leads at high ranks
- Unsolved threads weave through the game's overarching story

**Bureau as a living space:**
- Rank 1–5: Small office, corkboard, coffee machine
- Rank 6–10: Second room, NPC assistant, archive access
- Rank 11–15: Full floor, forensics lab (bonus clues)
- Rank 16–20: International office, helicopter transport in-game
- Rank 21+: HQ, other detectives work for you

---

## Business Model

**Freemium + Subscription**

| Tier | Price | What You Get |
|------|-------|--------------|
| Free | 0 | Daily case, 3 free questions per interrogation |
| Detective+ | 49 SEK/month (~$5) | Unlimited questions, case archive, bureau upgrades |
| Extra questions | 9 SEK each | Buy more questions for a single session |
| Case packs | 29 SEK | 5 archive cases |

**Revenue projections (conservative):**
- 1,000 DAU × 5% conversion = 50 paying users × 49 SEK = 2,450 SEK/month
- 10,000 DAU × 5% = 500 paying users = 24,500 SEK/month (~$2,300)
- Plus micro-transactions on top

**Unit economics:**
- Case generation (Claude Haiku): ~0.50 SEK per case generated
- Daily case: ~50 SEK to generate (served to all players = fraction of a cent per player)
- Unique archive cases: 0.50 SEK each, sold for 5–9 SEK

---

## Tech Stack

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS
Auth:         Supabase Auth
Database:     Supabase (PostgreSQL)
AI:           Claude API (Haiku for case generation + character responses)
Payments:     Stripe
Email:        Resend
Hosting:      Vercel
```

---

## MVP Scope (V1)

What ships first:

- [ ] World map with city selection (8 countries)
- [ ] Daily case generation (English, same for all players)
- [ ] Free-text interrogation against Claude-powered characters
- [ ] "Find the crack" accusation mechanic
- [ ] XP + rank system (20 ranks)
- [ ] Streak tracking
- [ ] Shareable results card (like Wordle)
- [ ] Supabase auth (email + Google)
- [ ] Stripe subscription (Detective+ tier)
- [ ] Localization support: EN, SV, ES, PT

**V2 (post-launch):**
- Case archive (old daily cases)
- Character continuity across cases
- Crime waves + seasonal events
- Bureau upgrades
- Special assignments at rank 10+
- Mobile app (React Native or PWA)

---

## What We Don't Know Yet (Open Questions)

1. **Case quality:** How consistent can Claude be at generating compelling, solvable cases? Need to test heavily.
2. **Difficulty calibration:** Cases need to be hard enough to feel rewarding but solvable in 10–15 minutes
3. **Viral loop:** Is the daily sharing mechanic strong enough? Do we need a competitive element?
4. **Monetization timing:** When do we introduce the paywall? After case 1? After rank 3?
5. **Content moderation:** Free-text interrogation — what do players try to do that breaks immersion?

---

## The Founder

Building this from scratch with Claude Code. Single founder, technical execution handled by AI pair programming. Goal: ship a working V1 within 6 weeks, get first 100 paying users within 3 months.

---

## Tone & Strategic Principles

When advising on this project, you should:
- Challenge assumptions aggressively — don't just validate
- Think about retention and monetization together, not separately
- Prioritize shipping over perfection in early stages
- Reference comparable games (Wordle, Connections, Duolingo, Among Us, Her Story)
- Point out when we're over-engineering or under-thinking
- Be direct about what could kill the product (bad retention, content quality, cost blowout)

The goal is to build something people play every morning like they check their phone — a habit, not an app.
