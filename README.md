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

## Architecture

| Layer | Stack | Role |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite | Plain HTML data browser. No CSS. |
| Backend | Rust + Axum | Read-only JSON API over Supabase. |
| Database | Supabase Postgres | Leads, properties, projects, agents, conversations, messages, appointments, follow-ups, activities and templates. |

The backend talks to Supabase through its REST (PostgREST) API using the
project's `service_role` key. The key stays on the server and is never sent to
the browser.

## Requirements

- Rust toolchain (`cargo`)
- Node.js 20+ (`npm`)
- Supabase project URL and `service_role` key

## Run

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env and set SUPABASE_SERVICE_ROLE_KEY
cargo run
```

Backend: http://localhost:8080

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

The frontend defaults to `http://localhost:8080` for the API. Override it with
`VITE_API_URL` if the backend runs elsewhere.

## Backend API

All endpoints are `GET` and return JSON. List endpoints support `limit`,
`offset` and resource-specific filters.

| Endpoint | Description |
| --- | --- |
| `/health` | Backend and Supabase connectivity |
| `/api/dashboard/summary` | Counts for leads, inventory, agents, conversations, follow-ups and appointments |
| `/api/leads` | Leads with status, source, city, agent, score and search filters |
| `/api/leads/{id}` | Lead with agent, conversations, appointments, follow-ups and activities |
| `/api/properties` | Properties with city, type, listing, price, bedrooms, availability and search filters |
| `/api/properties/{id}` | Property with its project |
| `/api/projects` | Projects with city, status, type and search filters |
| `/api/projects/{id}` | Project with its properties |
| `/api/agents` | Agents with active and search filters |
| `/api/agents/{id}` | Agent with assigned leads |
| `/api/conversations` | Conversations with lead, status and channel filters |
| `/api/conversations/{id}` | Conversation with its lead and messages |
| `/api/messages` | Messages with lead, conversation, direction and sender filters |
| `/api/appointments` | Appointments with lead, agent, status, type and upcoming filters |
| `/api/follow-ups` | Follow-ups with lead, status, channel and due-date filters |
| `/api/activities` | Lead activities with lead, type and creator filters |
| `/api/interested-leads` | Interested leads with status, source, city and search filters |
| `/api/message-templates` | Templates with category and active filters |

## Frontend routes

| Route | Page |
| --- | --- |
| `/` | Dashboard summary and recent leads |
| `/leads` | Leads list |
| `/leads/{id}` | Lead detail with related records |
| `/properties` | Properties list |
| `/properties/{id}` | Property detail and project |
| `/projects` | Projects list |
| `/projects/{id}` | Project detail and properties |
| `/agents` | Agents list |
| `/agents/{id}` | Agent detail and assigned leads |
| `/conversations` | Conversations list |
| `/conversations/{id}` | Conversation detail and messages |
| `/messages` | Message log |
| `/appointments` | Appointments list |
| `/follow-ups` | Follow-ups list |
| `/activities` | Activity log |
| `/interested-leads` | Interested leads list |
| `/message-templates` | Message templates list |

Routing uses URL hashes, so links look like `#/leads`.

## Project layout

```
backend/
  src/
    main.rs           server bootstrap
    config.rs         environment configuration
    supabase.rs       Supabase REST client
    query.rs          filter and pagination helpers
    models.rs         response models
    routes/           one module per resource
frontend/
  src/
    App.tsx           hash router
    api.ts            typed fetch wrapper
    types.ts          API response types
    components/       layout, table, filters, pagination, status
    pages/            dashboard, lists and detail pages
```

## Configuration

Backend environment variables (`backend/.env`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | project URL | Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | required | Server-side key that bypasses RLS |
| `PORT` | `8080` | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origins, comma-separated |

Frontend environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8080` | Backend base URL |

## Notes

- The database has RLS enabled with no policies, so anon/publishable keys
  cannot read these tables. The backend therefore requires the `service_role`
  key.
- `backend/.env`, `backend/target`, `frontend/node_modules` and `frontend/dist`
  are ignored by git.
