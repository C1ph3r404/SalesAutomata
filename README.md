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
npm run dev
```

Open http://localhost:3000

> npm's default registry is unreachable on some networks. If `npm install`
> hangs, switch mirror with
> `npm config set registry https://registry.npmmirror.com`.

## What's here

The app is currently a **static UI prototype** — no backend, no data fetching.
Every number on the dashboard is mocked in `lib/data.ts`.

```
app/                 Next.js app router
  page.tsx           dashboard composition
  globals.css        design tokens + component classes
components/
  chrome.tsx         status bar, footer band, shared marks
  hero.tsx           blue duotone cover panel
  sections.tsx       title, estimation grid, pipeline cards, chat panel
  Topbar.tsx         navigation with active state
  leads.tsx          filterable leads table
  users.tsx          team table
  automations.tsx    n8n connection + flow diagram
lib/data.ts          mock data
docs/                product + hackathon plans
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Dashboard |
| `/leads` | All leads, filterable by stage |
| `/leads/new` | New lead form |
| `/users` | Team list |
| `/users/[id]` | Per-user profile |
| `/automations` | n8n connection and workflow list |

## Design language

Dossier / database aesthetic: flat white panels on a warm paper field, hairline
rules, oversized tight-tracked headings, uppercase micro-labels, a single vivid
blue accent, and a black data band with a clipped diagonal edge. Decorative
Urdu lines use the `.script` class.
