# SalesAutomata — Everything That Still Needs To Be Done

This is the master checklist for the 24-hour hackathon build.

Legend:

- `[x]` done
- `[ ]` not done
- `P0` required for the demo
- `P1` should ship if time allows
- `P2` only after the demo works
- `CUT` explicitly not doing this weekend

---

## 1. The target demo

A judge sends a WhatsApp-style message and watches, live, as:

1. The message appears in a chat panel.
2. The bot replies in under 3 seconds.
3. A lead card fills itself in: intent, budget, timeline, location, contact.
4. The score updates from 0 to HOT with a one-line reason.
5. The bot handles an objection and offers two concrete viewing slots.
6. A booking appears on a calendar.
7. A silent lead gets a follow-up via the "time-warp" button.
8. The lead asks for a human and a handoff card with an AI summary appears.
9. An analytics screen shows plausible numbers.

If a feature does not appear in those 3 minutes, it is not a P0.

---

## 2. Current state

### Backend — already built

- [x] Shared types in `lib/types.ts`
- [x] Zod request validation in `lib/schemas.ts`
- [x] Server-side scoring in `lib/scoring.ts`
- [x] Prisma + SQLite schema in `prisma/schema.prisma`
- [x] Data layer in `lib/db/`
- [x] Seed + reset data in `lib/db/seed.ts` and `scripts/seed.ts`
- [x] SQLite database at `prisma/dev.db`
- [x] API error handling in `lib/api.ts`
- [x] `/api/turn` fallback in `lib/turn.ts` so frontend is not blocked
- [x] Endpoints for leads, users, metrics, workflows, reset, health, n8n webhook, messages, fields, appointments, followups, handoff, time-warp
- [x] `npm run typecheck` passes
- [x] API smoke tests pass

Useful commands:

```bash
npm run db:push
npm run db:seed
npm run dev
npm run typecheck
```

### Frontend — wired to the backend

Pages now read from `lib/db/*` and write through `app/api/*`. `lib/data.ts` is
only used by `lib/db/seed.ts`.

- [x] Dashboard reads metrics, pipeline leads, and the active conversation
- [x] Leads list reads real leads and filters them client-side
- [x] New lead form posts to `/api/leads`
- [x] Users list and profile read real users and assigned leads
- [x] Automations reads real workflows and checks `/api/health`
- [x] Lead detail route with card, chat, booking, follow-ups, and handoff
- [x] WhatsApp simulator route with live polling and time-warp
- [x] Reset-demo control in the top bar, simulator, and lead detail actions
- [x] Loading, error, empty, and not-found states

---

## 3. Ownership

| Owner | Files |
|---|---|
| **You** | `lib/db/**`, `lib/types.ts`, `lib/schemas.ts`, `lib/scoring.ts`, `lib/api.ts`, `app/api/**`, all `app/**` pages, `components/**`, `prisma/**`, `scripts/**` |
| **AI teammate** | `lib/agent/**`, prompt/tool logic behind `/api/turn` |
| **n8n teammate** | n8n workflows, Twilio sandbox, calls to `/api/webhook/n8n` |
| **Demo/pitch teammate** | `docs/demo.md`, seed realism, reset button, slides, backup recording, rehearsal |

Do not edit another owner's files without telling them. The API in this repo is the contract between everyone.

---

## 4. Frozen contracts

### 4.1 Lead fields

Every `Lead` in the database/API has these fields:

```text
id
externalId
name
phone
source
requirement
intent
budget
timeline
location
notes
stage          NEW | QUALIFYING | HOT | BOOKED | LOST
score          0..100
scoreReason    one-line human-readable reason
ownerId
handoffRequested
handoffSummary
handoffAt
createdAt
updatedAt
```

Related records:

- `Message`: `id, leadId, conversationId, direction(in/out), body, channel(whatsapp/sim), waMessageId, status, createdAt`
- `Conversation`: `id, leadId, status(bot/human/closed), assignedTo, lastMessageAt`
- `Appointment`: `id, leadId, startsAt, endsAt, status(booked/cancelled/done), notes`
- `Followup`: `id, leadId, runAt, reason, step, status(pending/sent/cancelled), sentAt`
- `User`: `id, name, initials, role, phone, email, timezone, status, seat, joined, lastActive, response, conversion, tint`
- `Workflow`: `id, name, status, runs, last, desc`

### 4.2 Scoring rule

The backend owns scoring. The AI must never send a score.

```text
base 5
+10 intent
+20 budget
+15 timeline
+10 requirement
+5  location
+10 phone/contact
+15 appointment booked

HOT          >= 75
QUALIFYING   >= 45
NEW          < 45
BOOKED       when an appointment exists
LOST         preserved once set manually
```

`scoreReason` always says what is known and what is missing, for example:

```text
intent investment · budget 3.2 Cr · timeline 30 days · requirement captured · missing contact
```

### 4.3 API endpoints

Frontend:

| Method | Route | Body / Query | Response |
|---|---|---|---|
| GET | `/api/leads` | `stage`, `q`, `ownerId`, `limit` | `{ leads }` |
| POST | `/api/leads` | `CreateLeadInput` | `{ lead }` 201 |
| GET | `/api/leads/[id]` | — | `{ lead }` with messages/appointments/followups |
| PATCH | `/api/leads/[id]` | `name`, `phone`, `source`, `notes`, `stage`, `ownerId` | `{ lead }` |
| GET | `/api/users` | — | `{ users }` |
| GET | `/api/users/[id]` | — | `{ user }` + `assignedLeads` |
| GET | `/api/metrics` | — | `{ metrics }` |
| GET | `/api/workflows` | — | `{ workflows }` |
| POST | `/api/reset` | — | `{ ok: true }` |
| GET | `/api/health` | — | `{ ok: true }` |

AI agent:

| Method | Route | Body | Effect |
|---|---|---|---|
| PATCH | `/api/leads/[id]/fields` | `intent`, `budget`, `timeline`, `location`, `requirement` | Updates fields and recomputes score |
| POST | `/api/leads/[id]/messages` | `direction`, `body`, `channel`, `waMessageId`, `status` | Stores a message |
| POST | `/api/leads/[id]/appointments` | `startsAt`, `endsAt?`, `durationMinutes?`, `notes?`, `status?` | Books appointment + stage BOOKED |
| POST | `/api/leads/[id]/followups` | `runAt`, `reason`, `step` | Schedules follow-up |
| POST | `/api/leads/[id]/handoff` | `summary?`, `assignedTo?` | Marks human handoff |
| POST | `/api/turn` | `leadId`, `message`, `channel?` | Full turn result |

n8n:

| Method | Route | Body | Effect |
|---|---|---|---|
| POST | `/api/webhook/n8n` | Same as create lead; use `externalId` for dedupe | Creates/returns lead |

Demo helpers:

| Method | Route | Effect |
|---|---|---|
| POST | `/api/time-warp?days=3` | Marks due follow-ups sent and adds them to the thread |
| POST | `/api/reset` | Reseeds the demo database |

Important: server components should import `lib/db/*` directly, not call `/api/...` with a relative URL.

---

## 5. Workstream A — Frontend wiring (P0, highest priority)

### 5.1 Dashboard

- [x] `app/page.tsx` becomes a dynamic server component.
- [x] Fetch `getMetrics()`, `listLeads({ limit: 4 })`, and the latest conversation for the chat panel.
- [x] Add `export const dynamic = "force-dynamic";` so the demo never serves stale data.
- [x] Pass real data into `sections.tsx` instead of importing mock arrays.
- [x] Replace the fake "Syncing WhatsApp leads… 70%" status bar with real data or remove the fake progress.

### 5.2 Dashboard components

- [x] `components/sections.tsx`: change `InfoA`, `InfoB`, `PipelineStrip`, `ChatPanel` to accept props.
- [x] `PipelineStrip` uses real leads and links each card to `/leads/[id]`.
- [x] `ChatPanel` renders real messages for the selected lead.
- [x] `InfoA` uses metrics: median first reply, viewings booked today.
- [x] `InfoB` uses metrics: qualification rate, estimated close, cadence count.

### 5.3 Leads list

- [x] `app/leads/page.tsx`: fetch `listLeads()` server-side.
- [x] `components/leads.tsx`: accept `initialLeads` as a prop instead of importing `leads` from `lib/data`.
- [x] Keep client-side stage filtering.
- [x] Make every row link to `/leads/[id]`.
- [x] Add empty state: "No leads in this stage."
- [x] Add a "+ New lead" button that works.

### 5.4 New lead form

- [x] `app/leads/new/page.tsx`: make it a client component.
- [x] Add controlled fields for name, phone, source, requirement, budget, owner, notes.
- [x] On submit: `POST /api/leads`.
- [x] Show loading state while submitting.
- [x] On success: redirect to `/leads/[id]` or `/leads`.
- [x] On failure: show the API validation message inline.

### 5.5 Lead detail page (new)

- [x] Create `app/leads/[id]/page.tsx`.
- [x] Load `getLead(id)` server-side; call `notFound()` when missing.
- [x] Render:
  - [x] Lead card: name, phone, source, stage, score, reason.
  - [x] Qualification fields: intent, budget, timeline, location, requirement.
  - [x] Chat thread: inbound and outbound messages.
  - [x] Appointment panel: booked slot or "no booking".
  - [x] Follow-up panel: pending and sent follow-ups.
  - [x] Handoff panel: summary when `handoffRequested`.
- [x] Add controls:
  - [x] Change stage.
  - [x] Assign owner.
  - [x] Book appointment.
  - [x] Schedule follow-up.
  - [x] Trigger handoff.
- [x] Use small client components for controls and call the API.

### 5.6 Users

- [x] `app/users/page.tsx`: fetch `listUsers()`.
- [x] `components/users.tsx`: accept props instead of importing `users`.
- [x] `app/users/[id]/page.tsx`: fetch `getUser(id)` instead of using mock arrays.
- [x] Keep profile stats, assigned leads, and recent activity.
- [x] Add empty state for a user with no leads.

### 5.7 Automations

- [x] `app/automations/page.tsx`: fetch `listWorkflows()`.
- [x] `components/automations.tsx`: accept workflows as props.
- [x] Replace the fake 900ms connect timeout:
  - [x] "Test connection" calls `GET /api/health`.
  - [x] Show connected/failed status.
- [x] Show the real n8n webhook URL from an env var if available:
  - [x] `NEXT_PUBLIC_APP_URL` + `/api/webhook/n8n`.
- [x] Make "Copy" actually copy the URL.

### 5.8 WhatsApp simulator (new, P0)

- [x] Create `app/sim/page.tsx`.
- [x] Create `components/chat-sim.tsx`.
- [x] Add a lead selector using real leads.
- [x] Render the selected lead's messages.
- [x] Add a text input and send button.
- [x] On send: `POST /api/turn` with `{ leadId, message, channel: "sim" }`.
- [x] Render the reply immediately.
- [x] Show "typing…" while waiting.
- [x] Poll `GET /api/leads/[id]` every 1–2 seconds so the lead card fills live.
- [x] Show the live lead card next to the chat:
  - [x] score
  - [x] stage
  - [x] reason
  - [x] intent
  - [x] budget
  - [x] timeline
  - [x] location
  - [x] appointment
  - [x] handoff
- [x] Add a "reset demo" button.
- [x] Add a "time-warp +3 days" button.

### 5.9 Reset button

- [x] Create `components/reset-button.tsx`.
- [x] On click: confirm, `POST /api/reset`, then `router.refresh()`.
- [x] Place it in the top bar or on `/sim`.
- [x] Make it visually obvious for the demo.

### 5.10 Navigation and polish

- [x] Add "Simulator" to `components/Topbar.tsx`.
- [x] Make the theme toggle work or remove it.
- [ ] Check mobile viewport.
- [ ] Check type sizes are readable from 3 metres on the demo screen.
- [x] Remove all unused mock imports.

### 5.11 Frontend definition of done

- [x] No page/component imports `leads`, `users`, `bubbles`, `activity`, `metaRows`, or `workflows` from `lib/data.ts`.
- [x] Only `lib/db/seed.ts` imports mock data.
- [x] Every button either works or is removed.
- [x] Every page has loading, empty, and error states.
- [x] `npm run typecheck` passes.
- [x] `npm run build` passes.

---

## 6. Workstream B — AI agent integration (P0, owned by AI teammate)

- [ ] Freeze `runTurn(leadId, message) -> TurnResult`.
- [ ] Implement the real agent behind `POST /api/turn`.
- [ ] Keep the existing `lib/turn.ts` fallback available until the real agent is stable.
- [ ] Build the system prompt from:
  - [ ] Al-Noor Realty listings.
  - [ ] Price ranges.
  - [ ] FAQ / objections.
  - [ ] Qualification fields.
- [ ] Implement tools:
  - [ ] `set_field` → `PATCH /api/leads/[id]/fields`
  - [ ] `book_appointment` → `POST /api/leads/[id]/appointments`
  - [ ] `schedule_followup` → `POST /api/leads/[id]/followups`
  - [ ] `handoff_to_human` → `POST /api/leads/[id]/handoff`
  - [ ] `send_message` → `POST /api/leads/[id]/messages`
- [ ] Never let the AI set `score` or `stage`; the backend owns those.
- [ ] Validate every tool call server-side with Zod.
- [ ] Keep replies under 3 seconds; stream or show "typing…".
- [ ] Temperature around 0.3.
- [ ] Handle:
  - [ ] "Is the 2BHK available?"
  - [ ] "What is the price?"
  - [ ] "3.2 crore is too high."
  - [ ] "Can you do a viewing?"
  - [ ] "Talk to a human."
  - [ ] Off-topic messages.
- [ ] Offer exactly two concrete slots when booking.
- [ ] Trigger handoff on explicit request, complaint, or repeated low confidence.
- [ ] Do not quote a price that is not in the listings text.

---

## 7. Workstream C — n8n and WhatsApp (P1, owned by n8n teammate)

- [ ] Build an n8n workflow:
  - [ ] Trigger: inbound WhatsApp message or simulator.
  - [ ] Normalize to the create-lead payload.
  - [ ] `POST /api/webhook/n8n` with a stable `externalId`.
  - [ ] Handle duplicate webhooks idempotently.
- [ ] Map fields: name, phone, source, requirement, intent, budget, timeline, location, initialMessage.
- [x] Verify duplicate `externalId` returns the same lead.
- [ ] Twilio WhatsApp sandbox:
  - [ ] Join code.
  - [ ] Send test message from two phones.
  - [ ] Send reply back through the workflow.
- [ ] If Twilio fights you for more than 45 minutes, abandon it.
- [ ] The simulator is the primary demo. The phone is a bonus.
- [x] Show the webhook URL in the Automations UI.
- [ ] Optional: require a shared secret header on the webhook.

---

## 8. Workstream D — Demo data, reset, and analytics (P0)

- [x] Seed one realistic tenant: Al-Noor Realty.
- [x] Seed leads in every stage:
  - [x] at least 1 HOT
  - [x] at least 1 QUALIFYING
  - [x] at least 1 BOOKED
  - [x] at least 1 NEW
  - [x] at least 1 human-handoff lead
- [x] Seed "Ahmed" as the main demo lead with:
  - [x] a conversation
  - [x] budget, timeline, intent
  - [ ] a viewing slot
- [x] Seed a silent lead for the time-warp demo.
- [x] Seed follow-ups at +1, +3, and +7 days.
- [x] Seed one appointment tomorrow at 5 PM.
- [x] Seed workflows for the Automations page.
- [x] Make `POST /api/reset` restore everything.
- [x] Add a big "RESET DEMO" button.
- [ ] Analytics screen:
  - [x] leads received
  - [x] median first response
  - [x] qualification rate
  - [x] booking rate
  - [ ] follow-ups sent
  - [x] booked viewings today
- [x] Use real DB counts where possible; hardcode only the numbers that are expensive to compute.

---

## 9. Workstream E — QA and hardening (P0 before freeze)

- [x] Run `npm run typecheck`.
- [x] Run `npm run build` (passed in an isolated copy; dev server left running).
- [x] Smoke-test every endpoint with curl or a script.
- [ ] Test invalid JSON → 400.
- [x] Test missing fields → 422.
- [ ] Test missing lead → 404.
- [x] Test duplicate n8n webhook → same lead.
- [ ] Test duplicate `waMessageId` → one message.
- [x] Test reset from a dirty DB.
- [ ] Test the full 3-minute demo path 5 times in a row.
- [ ] Test on a fresh clone:
  - [ ] `npm install`
  - [ ] `npm run db:push`
  - [ ] `npm run db:seed`
  - [ ] `npm run dev`
- [ ] Test in a mobile viewport.
- [ ] Check browser console for errors.
- [x] Check server log for Prisma errors.
- [x] Make sure no `console.log` secrets or API keys are present.
- [ ] Add a simple `scripts/smoke.ts` if useful.

### Error-state checklist

- [x] Chat send failure shows a retry message.
- [x] Empty lead list shows a friendly state.
- [x] Empty message thread shows a prompt.
- [x] Missing lead shows 404.
- [x] API failure on the dashboard does not blank the whole page.
- [x] Reset failure tells the user.

---

## 10. Workstream F — Deployment (P1)

- [x] Decide demo environment:
  - [x] Local laptop (recommended, SQLite works).
  - [ ] Vercel (requires Postgres; SQLite will not persist).
- [ ] If Vercel + Neon Postgres:
  - [ ] Change `prisma/schema.prisma` provider to `postgresql`.
  - [ ] Set `DATABASE_URL` in Vercel.
  - [ ] Run `prisma db push`.
  - [ ] Run the seed.
  - [ ] Add `postinstall: "prisma generate"` or `build: "prisma generate && next build"`.
  - [ ] Test the deployed demo end to end.
- [ ] Set `NEXT_PUBLIC_APP_URL` for webhook display.
- [x] Do not commit `.env` or `prisma/dev.db`.
- [x] Confirm `.env.example` is committed.
- [ ] Keep a local backup of the seeded DB if needed.

---

## 11. Workstream G — Demo and pitch (P0, final 2 hours)

- [ ] Write the exact 3-minute script in `docs/demo.md`.
- [ ] Rehearse it out loud 3 times, timed.
- [ ] Two people drive the laptop; one presents.
- [ ] Record a full backup video.
- [ ] Record a second backup video.
- [ ] Have a phone hotspot ready.
- [ ] Close all other tabs and notifications.
- [ ] Pre-warm the server and LLM before going on stage.
- [ ] Prepare slides:
  - [ ] problem
  - [ ] live demo
  - [ ] business model
  - [ ] what is next
- [ ] Prepare the honest answer:
  - [ ] "WhatsApp is real, calendar is stubbed, CRM is mocked. Qualification, scoring, and follow-up are real."
- [ ] Prepare the "what is hard?" answer:
  - [ ] "WhatsApp's 24-hour window and template approval."

---

## 12. Suggested order from now

Assuming roughly 20 hours remain:

1. `[P0]` 0:00–2:00 — wire dashboard, leads list, new lead, users. Get CRUD visible.
2. `[P0]` 2:00–4:00 — build `/sim` and `/leads/[id]`; live lead card and chat.
3. `[P0]` 4:00–6:00 — booking, follow-ups, handoff UI.
4. `[P0]` 6:00–7:30 — reset button, seed realism, analytics.
5. `[P1]` 7:30–9:30 — integrate real AI agent; fix latency and tool calls.
6. `[P1]` 9:30–11:00 — integrate n8n webhook; optional Twilio.
7. `[P0]` 11:00–13:00 — QA, full demo path, mobile, error states.
8. `[P0]` 13:00–14:00 — build check, fresh-clone check, deploy check.
9. `[P0]` 14:00–16:00 — freeze, backup video, rehearsal, pitch.
10. Buffer.

If you are behind at any point, cut in this order:

1. Analytics
2. Automations page
3. Real n8n
4. Handoff
5. Real Twilio

Never cut:

1. Leads CRUD
2. Simulator chat
3. Live lead card
4. Score
5. Booking
6. Reset

---

## 13. Explicitly cut

- `[CUT]` Meta business verification / WABA
- `[CUT]` Auth, signup, login
- `[CUT]` Multi-tenancy
- `[CUT]` Stripe, billing, metering
- `[CUT]` Real CRM sync
- `[CUT]` Vector DB / RAG
- `[CUT]` Voice notes
- `[CUT]` Multilingual
- `[CUT]` Real Google Calendar
- `[CUT]` CI, migrations, unit-test suite
- `[CUT]` Beautiful design polish

---

## 14. Definition of done

The build is done when all of these are true:

- [x] `npm run typecheck` passes.
- [x] `npm run build` passes.
- [x] `npm run db:seed` produces a clean demo.
- [x] New lead form creates a real lead.
- [x] Leads list filters real data.
- [x] Lead detail shows real fields, messages, appointments, follow-ups.
- [x] Simulator sends a message and gets a reply.
- [x] Lead card fills live during the simulator demo.
- [x] Score reaches HOT with a reason.
- [x] Booking creates an appointment visible on screen.
- [x] Time-warp sends follow-ups into the thread.
- [x] "Talk to a human" creates a handoff summary.
- [x] Reset button restores the demo in under 5 seconds.
- [x] n8n webhook creates a lead and deduplicates retries.
- [ ] Full demo runs end to end in under 3 minutes without manual DB edits.
- [ ] Backup video exists.
- [ ] The team has rehearsed at least 3 times.