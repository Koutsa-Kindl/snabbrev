# Cold Bureau — Claude Code Context

> This file tells Claude Code who we are, what we're building, and how to work with this codebase.

## Project

**Cold Bureau** — a daily detective game. Players run a detective agency, interrogate AI suspects using free text, and crack murder cases. One case daily (same for everyone, Wordle-style), plus an archive of past cases.

## Architecture

```
/app                    Next.js 14 App Router
  /api                  API routes
    /case               Daily case generation + retrieval
    /interrogate        Free-text suspect interrogation (Claude)
    /accuse             Submit accusation + verdict
    /auth               Auth callbacks
  /(game)               Game UI routes
    /map                World map + bureau selection
    /case               Active case + interrogation UI
    /bureau             Player bureau + stats
    /archive            Past cases (Detective+ only)
  /(marketing)          Landing page, pricing
/lib
  /supabase             Database client + queries
  /claude               AI client + prompts
  /stripe               Payment helpers
  /game                 Game logic (scoring, XP, ranks)
/components             Shared UI components
```

## Key Concepts

**Daily case:** Generated once at midnight UTC, stored in Supabase, served to all players. Contains: title, setting, victim, 3–5 suspects (each with backstory, alibi, motive, and the actual truth), and one "crack" — a logical inconsistency in the killer's story.

**Interrogation:** Player asks free-text questions. We send to Claude with the suspect's character card + what they know + instructions to stay in character, lie if they're the killer, and occasionally reveal small truths. Claude responds in character.

**The crack:** A specific logical inconsistency defined when the case is generated. Players must find it to win. We check their accusation against the stored crack.

**XP + Ranks:**
- Correct accusation: 100 XP base
- Bonus for fewer questions used: up to +50 XP
- Streak bonus: +10 XP per day streak
- 20 ranks total, escalating XP thresholds

## Tech Stack

- **Next.js 14** — App Router, TypeScript, server components where possible
- **Supabase** — auth, database, real-time
- **Claude API** — Haiku for case gen + interrogation (cost-sensitive, use Haiku)
- **Stripe** — subscriptions + one-time purchases
- **Resend** — transactional email
- **Vercel** — hosting

## Database Schema (key tables)

```sql
players          id, email, bureau_city, xp, rank, streak, created_at
daily_cases      id, date, case_json, generated_at
player_sessions  id, player_id, case_id, questions_used, accused_id, solved, xp_earned
interrogations   id, session_id, suspect_id, question, response, timestamp
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
```

## Working Principles

- Use Claude Haiku (not Sonnet/Opus) for all in-game AI calls — cost matters at scale
- Server components for data fetching, client components only for interactivity
- Never expose case solutions to the client — all verdict logic server-side
- Free tier: 3 questions per interrogation per suspect. Enforce server-side.
- Daily case resets at midnight UTC — use date as cache key

## Current Status

Building V1 MVP. Branch: `claude/games-saas-architecture-In5LV`

V1 includes: world map, city selection (8 cities), daily case, free-text interrogation, accusation mechanic, XP/rank, streak, shareable result card, Supabase auth, Stripe subscription.
