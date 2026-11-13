# SalesAutomata

## Problem Statement: AI WhatsApp Sales Closer

| Attribute | Details |
| --- | --- |
| **Domain** | Sales Automation / Conversational AI |
| **Problem** | Businesses receive leads through WhatsApp but fail to follow up consistently, qualify prospects or convert enquiries into sales. |
| **Target customers** | Real estate agencies, education companies, insurance agencies, automobile dealers, travel agencies and SMEs. |
| **Revenue streams** | Monthly subscription; per-agent pricing; per-conversation charges; premium CRM integrations; enterprise licences. |
| **MVP** | Connect WhatsApp, qualify incoming leads, automate follow-ups and schedule appointments. |
| **Market potential** | Very high – customers can measure its value through lead conversion and sales revenue. |

## Run

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

> npm's default registry is unreachable on some networks. If `npm install`
> hangs, switch mirror with
> `npm config set registry https://registry.npmmirror.com`.

## What's here

The app is a working Next.js dashboard backed by SQLite through Prisma. The
dashboard, leads, users, lead detail, and simulator pages read from the database.
Writes go through the API routes under `app/api/`.

```
app/                 Next.js app router
  page.tsx           dashboard composition (server component)
  leads/             leads list, new lead, lead detail
  sim/               WhatsApp simulator
  api/               REST API routes
  globals.css        design tokens + component classes
components/
  chrome.tsx         status bar, footer band, shared marks
  hero.tsx           blue duotone cover panel
  sections.tsx       dashboard metrics, pipeline cards, chat panel
  Topbar.tsx         navigation + demo reset
  leads.tsx          filterable leads table
  lead-detail.tsx    lead controls, chat, bookings, follow-ups
  chat-simulator.tsx simulator chat with live polling
  automations.tsx    n8n connection + workflow list
lib/
  types.ts           shared API types
  schemas.ts         Zod request validation
  scoring.ts         lead scoring
  db/                Prisma client, data access, seed
  turn.ts            fallback `/api/turn` implementation
prisma/schema.prisma SQLite schema
docs/                product, hackathon, and remaining-work plans
```

### Demo commands

```bash
npm run db:seed      # reset the demo database
npm run db:studio    # inspect the database
npm run typecheck    # TypeScript check
curl -X POST http://localhost:3000/api/reset   # reseed from the app
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Dashboard |
| `/leads` | All leads, filterable by stage |
| `/leads/new` | New lead form |
| `/leads/[id]` | Lead detail: card, chat, booking, follow-ups, handoff |
| `/sim` | WhatsApp simulator with live lead card |
| `/users` | Team list |
| `/users/[id]` | Per-user profile |
| `/automations` | n8n connection and workflow list |

## Design language

Dossier / database aesthetic: flat white panels on a warm paper field, hairline
rules, oversized tight-tracked headings, uppercase micro-labels, a single vivid
blue accent, and a black data band with a clipped diagonal edge. Decorative
Urdu lines use the `.script` class.
