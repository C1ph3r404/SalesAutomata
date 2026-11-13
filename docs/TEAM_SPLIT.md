# PS 14 — AI WhatsApp Sales Closer: 4-Workstream Split

Goal: 6–8 weeks to a chargeable v1 with 4 people working in parallel.

The split is by **ownership boundary**, not by layer, so that no two people edit the same files.
That only works if the **shared contracts are frozen in week 1** (see §1).

---

## 0. Repo shape (prevents merge conflicts)

```
apps/
  web/          # Next.js dashboard + API routes        -> Stream C
  worker/       # queue bootstrap, ~50 LOC              -> Stream A (then frozen)
packages/
  core/         # zod types, events, Prisma schema      -> SHARED, week 1 only
  whatsapp/     # Meta Cloud API, webhook, send, templates -> Stream A
  agent/        # qualification machine, LLM, scoring   -> Stream B
  automation/   # scheduler, cadence, booking, CRM, billing -> Stream D
docs/
```

Rule: a stream only writes inside its own directory. `packages/core` changes require
approval from all four (label `contract-change`).

---

## 1. Week 1: everyone builds the contracts (non-negotiable)

Nobody writes feature code until these exist on `main`. Assign one driver per item,
but all four review.

| # | Contract | Driver | Contents |
|---|---|---|---|
| C1 | DB schema | A | `tenants`, `users`, `whatsapp_accounts`, `leads`, `conversations`, `messages`, `lead_fields`, `appointments`, `followups`, `templates`, `events` |
| C2 | Event + queue names | A | `inbound.message`, `outbound.send`, `lead.updated`, `followup.due`, `handoff.requested`, `crm.push` — plus payload zod schemas |
| C3 | Agent turn API | B | `runTurn(conversationId, inbound) -> TurnResult` |
| C4 | Tool contract | B | `AgentTool<Input,Output>` interface, server-side validation rules |
| C5 | Outbound interface | A | `sendText`, `sendTemplate`, `sendMedia`, `markRead`, `typing` |
| C6 | Scheduling interface | D | `schedule(leadId, runAt, reason)`, `cancelAll(leadId)` |
| C7 | Integration interfaces | D | `getAvailability`, `book`, `cancel`, `pushLead(platform, lead)` |
| C8 | Local harness | A | Fake WhatsApp + fake calendar so B/C/D never wait on Meta or Google |

Definition of done for week 1: `pnpm dev` boots web + worker + fake WhatsApp UI,
a message typed in the fake client round-trips to an echo bot and appears in the DB.

---

## 2. The four workstreams

### Stream A — WhatsApp Platform & Ingestion
**Owner profile:** backend / integrations engineer
**Owns:** `packages/whatsapp`, `apps/worker`, infra + deploy

**Deliverables**
1. Meta app, WABA, business verification, display name, test number (start day 1 — 1–3 week lead time).
2. Webhook receiver: signature verification, dedupe by `wa_message_id`, idempotency, ordering per conversation.
3. Inbound normalizer → `inbound.message` event (text, media refs, voice-note download).
4. Outbound dispatcher with rate limiting, retry/backoff, delivery-status tracking (`sent`/`delivered`/`read`/`failed`).
5. Template registry: create, submit for approval, track status, map local keys → Meta template names.
6. 24-hour window enforcement: free-form inside, template-only outside (hard gate, logged).
7. Local simulator UI: conversation list, send as customer, inspect raw payloads.
8. Infra: staging + prod, secrets, logs, queue dashboard, alerting on webhook failures.

**Definition of done:** a real phone can message the test number and get a reply end-to-end in staging; p95 inbound→outbound < 3s; duplicate webhooks produce one message.

**Does not do:** decide *what* to reply. That is Stream B.

---

### Stream B — Conversation Intelligence
**Owner profile:** AI / backend engineer
**Owns:** `packages/agent`

**Deliverables**
1. Qualification state machine: 5–7 fields per vertical (intent, budget/range, timeline, location/requirement, decision-maker, contact) with required/optional and confidence.
2. LLM layer via Vercel AI SDK: language, tone, objection handling, tangents — constrained to one next action per turn.
3. Tool layer: `set_field`, `score_lead`, `offer_slots`, `book_appointment`, `handoff_to_human`, `send_template`, `faq_answer`. Every call zod-validated server-side.
4. Knowledge base v1: tenant `services`/pricing/FAQ table injected into context (no vector DB yet; add pgvector in week 6 only if needed).
5. Lead scoring 0–100 with a human-readable reason string; thresholds for hot/warm/cold and for auto-handoff.
6. Handoff triggers: explicit request, complaint, 3 consecutive low-confidence turns, high-value lead, out-of-scope question.
7. Multilingual + voice-note transcript handling (Whisper) — transcripts enter the same turn pipeline.
8. Eval suite: 60–100 scripted conversations (EN/UR/AR) with assertions (asked budget, never quoted an unlisted price, always booked or handed off). Run on every PR.

**Definition of done:** 5 scripted scenarios pass: hot lead books a slot; cold lead gets qualified and parked; price question answered only from the price table; objection handled then re-asked for the meeting; explicit "talk to a human" hands off in <1 turn.

**Does not do:** send messages directly. It returns `TurnResult`; Stream A's dispatcher sends.

---

### Stream C — Dashboard, Tenancy & Onboarding
**Owner profile:** full-stack / frontend engineer
**Owns:** `apps/web` (UI + API routes), auth, design system

**Deliverables**
1. Auth + multi-tenant isolation on every query (tenant from session, never from request body).
2. Onboarding wizard: create tenant → connect WABA → paste services/pricing/FAQs → pick vertical template → test conversation.
3. Inbox: thread list, filters (unread / hot / needs-human), message view, **takeover + hand-back** controls, note field.
4. Lead pipeline: kanban by stage, score badge + reason, timeline of messages and follow-ups, manual stage change.
5. Analytics: leads received, median first-response time, qualification rate, booking rate, follow-ups sent/replied, attributed revenue. Date range + per-agent.
6. Config screens: qualification fields, cadence schedule, quiet hours, business hours, handoff rules, team seats.
7. Empty/loading/error states, seed script for demo data, and a `/demo` tenant for sales calls.

**Definition of done:** a non-technical user can onboard a fake tenant, chat with it in the simulator, watch the lead card fill in live, take over the thread, and see it in analytics — without a developer.

**Does not do:** business logic. All writes go through Stream A/B/D package functions or thin API routes that call them.

---

### Stream D — Automation, Integrations & Billing
**Owner profile:** backend engineer (comfortable with jobs + third-party APIs)
**Owns:** `packages/automation`

**Deliverables**
1. Follow-up engine: cadence config (e.g. +15m, d1, d3, d7, d14, d30), per-step angle/template, quiet hours + timezone, stop on reply/opt-out/booked, max-attempt cap.
2. Reliability: delayed jobs survive restarts, no double-sends, dead-letter + replay.
3. Opt-out handling (STOP/unsubscribe) with a hard suppression list.
4. Calendar integration (Cal.com or Google): availability, 2–3 concrete slot offers, booking, reschedule, cancel, 24h + 1h reminder templates, no-show tagging.
5. CRM sync: HubSpot / Pipedrive / Zoho / generic webhook — push lead, stage, score, transcript link; inbound stage changes respected.
6. Billing: Stripe subscriptions (per location + per seat), metered usage for extra conversations and template messages, trial + dunning, plan limits enforced in code.
7. Usage metering pipeline: count Meta conversation charges vs. billed usage so margin is visible per tenant.

**Definition of done:** a lead that goes silent gets 3 correctly-spaced touches that stop the moment it replies; a booked slot appears in the real calendar with reminders; a Stripe test subscription gates features correctly.

**Does not do:** write to `messages` directly. It enqueues `outbound.send` (Stream A owns delivery).

---

## 3. Dependency graph

```
Week 1     [A][B][C][D] ---> contracts C1..C8 frozen
Week 2-3   A: ingress+send      B: machine+LLM      C: auth+onboarding   D: scheduler+booking
           \________________ M1: echo bot e2e ______________/
Week 4-5   A: templates+window   B: tools+scoring+eval  C: inbox+pipeline   D: cadence+calendar
           \________________ M2: qualified conversation books a slot ____/
Week 6-7   A: hardening/alerts   B: KB+multilingual     C: analytics+config D: CRM+billing
           \________________ M3: follow-ups + live dashboard ______________/
Week 8     A: prod cutover       B: tuning on real data C: polish+demo      D: metering + margin report
           \________________ M4: first paying tenant _____________________/
```

**Never block on another stream.** Use the week-1 harness:
- B tests `runTurn` with fixture messages, no WhatsApp.
- C tests against seeded DB + MSW, no real backend.
- D tests jobs with a fake clock and fake calendar.
- A tests with recorded Meta payload fixtures.

---

## 4. Working agreements

- **One shared staging environment**, deployed from `main` on every merge. Streams use feature flags, not long-lived branches.
- **`packages/core` is frozen after week 1.** Changes need a `contract-change` PR and all four approvals.
- **Nightly integration run**: simulator conversation → DB → analytics assertion. Failures are owned by whoever broke them, not "the integrator".
- **15-min daily sync**: only three questions — blocked on a contract? shipping what today? staging green?
- **Vertical templates are shared content, not code.** Put them in `docs/verticals/*.md` so sales can iterate without engineers (real estate, education, insurance, auto, travel).

## 5. Who to hire if only 3 people

Merge **Stream D into Stream A** (both are backend + jobs + third-party APIs) and keep B and C separate. Do **not** merge B into A — conversation quality is the product and needs a dedicated owner.
