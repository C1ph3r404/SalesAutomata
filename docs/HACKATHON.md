# PS 14 — 24-Hour Hackathon Plan

`docs/TEAM_SPLIT.md` is the 8-week product plan. **Ignore it this weekend.** This file is the
only plan that matters for the next 24 hours.

---

## 1. The one thing you are building

> A judge sends a WhatsApp message and watches a lead card fill itself in, get scored, get
> booked into a calendar, and get followed up — live, in 3 minutes.

Everything else is deleted. If a feature does not appear on screen during the demo, it does
not get built.

### Cut list (say no out loud, once, at hour 0)

| Cut | Why it's safe to cut |
|---|---|
| Meta business verification / WABA | Days of lead time. Use Twilio sandbox or the simulator. |
| Multi-tenancy, auth, signup | One hardcoded demo tenant. No login screen. |
| Stripe, billing, metering | Not demoable in 3 minutes. Put pricing on a slide. |
| CRM sync (HubSpot etc.) | Show a fake "CRM push" log panel instead. Say it's mocked. |
| Vector DB / RAG | Paste the agency's listings + FAQs into the system prompt. 40 lines of text. |
| Voice notes | Nice, only if you're ahead at hour 18. |
| Multilingual | One language. Unless a judge speaks Urdu — then one canned extra reply. |
| Tests, CI, migrations | `prisma db push`. One staging URL. |
| Beautiful design system | One dark dashboard, big numbers, readable from 3m away. |

### Keep list (this is the whole product)

1. Inbound message → reply in <3s
2. Qualification: intent, budget, timeline, contact — visibly extracted
3. Lead score 0–100 with a one-line reason
4. Objection handled, then a concrete appointment slot offered and booked
5. Follow-up that fires "later" via a **time-warp button**
6. Human handoff with an AI-written summary
7. One analytics screen with big fake-but-plausible numbers

---

## 2. Team of 4 — file ownership (zero merge conflicts)

Single Next.js app, no monorepo, no separate worker. One Postgres (Neon) or just SQLite.

| | Person | Owns (only writes here) | 24h deliverable |
|---|---|---|---|
| **P1** | AI / prompt engineer | `lib/agent/**` | System prompt, tool definitions, qualification extraction, scoring, handoff summary |
| **P2** | Integrations | `lib/whatsapp/**`, `app/api/webhook/**`, `app/sim/**` | Simulator chat UI, Twilio sandbox hookup, send/receive, dedupe |
| **P3** | Frontend | `app/(dashboard)/**`, `components/**` | Lead card, pipeline, calendar, analytics, time-warp button |
| **P4** | Glue / demo / pitch | `lib/demo/**`, `docs/demo.md`, `prisma/seed.ts` | Seed data, reset button, demo script, slide deck, backup recording, rehearsal |

**Hour 0 (30 min, all four together):** agree on ONE file, `lib/types.ts` — the `Lead`,
`Message`, `TurnResult` shapes. Then nobody talks to each other for 6 hours.

P4 is not a spare person. On a 24h hackathon the demo *is* the deliverable, and the person who
owns the reset button and the backup video is the difference between 1st place and a crashed
stage demo.

---

## 3. Hour-by-hour

### H0–H1 — Scope + skeleton
Pick the vertical: **real estate** (most relatable, clearest qualification fields).
`lib/types.ts` written and committed. Repo deployed to Vercel on hour 1, even if it says "hello".
P4 writes the demo script *now* — backwards from the script, not forwards from the code.

### H1–H4 — Vertical slice (the riskiest thing, first)
Hardcoded chat page → POST `/api/turn` → LLM with tools → reply appears.
**No database, no scoring, no styling.** Just: message in, sensible reply out, 10 times in a row.
If this isn't working by H4, cut tools and use a scripted state machine — it will still demo.

**H4 checkpoint:** 3 different test messages get 3 correct, on-topic replies.

### H4–H8 — Extraction + lead card
Prisma + `lead_fields`. The AI calls `set_field` and P3's card fills in live next to the chat.
Score computed on each turn with a reason string. Hardcode the score formula — do not ask the LLM
to invent it, or it will say 94 for "hi".

**H8 checkpoint:** the money shot works. Message → card fills → score jumps to HOT.

### H8–H12 — Booking
Fake calendar (a DB table + a calendar component, no Google API). AI offers exactly 2 slots,
`book_appointment` writes the row, the calendar updates on screen.
Kill Google Calendar integration the moment it costs you 30 minutes. Judges do not care if it's real.

**H12 checkpoint:** full happy path, one click, in under 90 seconds.

### H12–H16 — Follow-ups + handoff + analytics
- `followups` table with `run_at`. The **time-warp button** takes `now + N days` and flushes due rows.
  This is your second wow moment and it's 30 lines of code — do not build a real scheduler.
- Handoff: trigger on "talk to a human" → thread flagged, AI summary card appears in an agent inbox.
- Analytics: hardcode the numbers. One screen, huge type.

**H16 checkpoint:** the entire 3-minute script runs end to end without a manual DB edit.

### H16–H20 — Real WhatsApp + hardening
- Twilio WhatsApp sandbox (fastest real-phone path: join code, no verification). Test with 2 phones.
- If it fights you for >45 min, abandon it. The simulator on a big screen is fine.
- Then: error states, loading states, a demo that works on someone else's laptop, mobile viewport.

### H20–H22 — FREEZE
No new features. Ever.
- Record a full backup video of the demo. Twice.
- Rehearse out loud 3 times, timed.
- Two people drive the laptop, one presents. Never one person doing both.
- `seed.ts` + a big red "RESET DEMO" button.

### H22–H24 — Buffer + pitch
Slides: problem → live demo → business model → what's next. The live demo is 60% of your score.

---

## 4. The demo script (rehearse this exact thing)

**0:00 — Problem (20s).** "This agency gets 40 WhatsApp leads a week. Average reply time: 4 hours.
Most leads never get a second message. They're not losing deals to competitors — they're losing
them to their own inbox."

**0:20 — Live, from a judge's phone (60s).**
> Judge: *"Hi, is the 2BHK in DHA Phase 6 still available?"*
> Bot (2s): *"Yes — 1,450 sq ft, corner unit, ready to move. Are you buying for yourself or investment?"*
> Judge: *"Investment."*
> Bot: *"Got it. What budget range are you working with?"*

Point at the screen: **intent, budget, timeline, score 87 / HOT, and a one-line reason** —
all extracted automatically, next to the chat.

**1:20 — Objection → booking (40s).**
> Judge: *"3.2 crore is a bit high."*
> Bot: offers an alternate unit + *"I can hold a viewing Thursday 5pm or Saturday 11am — which suits?"*
> Judge picks one → **calendar event appears**.

**2:00 — Follow-up time-warp (40s).**
Switch to seeded lead "Ahmed" who went silent. Click **"+3 days"**.
Day-1 and day-3 follow-ups appear in the thread, each with a different angle. Ahmed replies,
asks for a human → **handoff card with AI summary** appears in the agent inbox.

**2:40 — Numbers + close (20s).**
Median first reply: 6 seconds. 24/7. Every lead followed up until a decision.
"We charge $199/month per office. One extra closed deal pays for three years."

---

## 5. Failure modes and the fix, decided in advance

| Risk | Pre-decided fix |
|---|---|
| LLM latency makes the demo feel dead | Stream the reply; show "typing…". Pre-warm the API before going on stage. |
| LLM says something unhinged on stage | Hard-gate prices to the listings table; validate every tool call server-side; temperature 0.3. |
| WiFi dies | Backup video (recorded at H21). Also tether to a phone. |
| Demo DB is dirty from testing | `RESET DEMO` button + a second seeded tenant. |
| Twilio sandbox doesn't deliver | Simulator is the primary demo; the phone is a bonus. Never make the phone load-bearing. |
| A judge asks "is this real?" | Be straight: "WhatsApp is real, calendar is stubbed, CRM is mocked. Here's what's real: the qualification, the scoring, the follow-up." Honesty scores better than a bluff. |
| You're behind at H12 | Cut analytics and handoff. Keep: chat → card → score → booking. That alone wins. |

---

## 6. Judging: what actually scores

Most hackathon rubrics weight **demo + problem clarity** far above code elegance.

- Lead with a **specific customer and a specific number**, not "businesses struggle with follow-up".
- Show the **before/after** in one screen: 4-hour reply vs 6-second reply.
- The lead card filling itself is your "oh, that's clever" moment — make it big and animated.
- Name the business model in one sentence. Don't mumble about "we'll figure out pricing".
- Have one answer ready for "what's hard about this?" → *"WhatsApp's 24-hour window and template
  approval. That's why follow-ups have to be template-driven, and we've built the cadence around it."*
  That answer proves you understand the domain, which is worth more than another feature.
