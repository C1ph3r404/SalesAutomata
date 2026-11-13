use axum::{Json, extract::State};
use serde_json::{Value, json};

use crate::{error::AppError, state::AppState};

pub async fn summary(State(state): State<AppState>) -> Result<Json<Value>, AppError> {
    let supabase = state.supabase.as_ref();

    let new = filter("status", "eq.new");
    let contacted = filter("status", "eq.contacted");
    let qualified = filter("status", "eq.qualified");
    let visit_scheduled = filter("status", "eq.site_visit_scheduled");
    let negotiation = filter("status", "eq.negotiation");
    let won = filter("status", "eq.won");
    let lost = filter("status", "eq.lost");
    let available = filter("availability", "eq.available");
    let active = filter("is_active", "eq.true");
    let open = filter("status", "eq.open");
    let pending = filter("status", "eq.pending");
    let scheduled = filter("status", "eq.scheduled");

    let (
        leads_total,
        leads_new,
        leads_contacted,
        leads_qualified,
        leads_visit_scheduled,
        leads_negotiation,
        leads_won,
        leads_lost,
        properties_total,
        properties_available,
        projects_total,
        agents_total,
        agents_active,
        conversations_open,
        follow_ups_pending,
        appointments_scheduled,
    ) = tokio::try_join!(
        supabase.count("leads", &[]),
        supabase.count("leads", &new),
        supabase.count("leads", &contacted),
        supabase.count("leads", &qualified),
        supabase.count("leads", &visit_scheduled),
        supabase.count("leads", &negotiation),
        supabase.count("leads", &won),
        supabase.count("leads", &lost),
        supabase.count("properties", &[]),
        supabase.count("properties", &available),
        supabase.count("projects", &[]),
        supabase.count("agents", &[]),
        supabase.count("agents", &active),
        supabase.count("conversations", &open),
        supabase.count("follow_ups", &pending),
        supabase.count("appointments", &scheduled),
    )?;

    Ok(Json(json!({
        "leads": {
            "total": leads_total,
            "new": leads_new,
            "contacted": leads_contacted,
            "qualified": leads_qualified,
            "site_visit_scheduled": leads_visit_scheduled,
            "negotiation": leads_negotiation,
            "won": leads_won,
            "lost": leads_lost
        },
        "properties": {
            "total": properties_total,
            "available": properties_available
        },
        "projects": { "total": projects_total },
        "agents": {
            "total": agents_total,
            "active": agents_active
        },
        "conversations": { "open": conversations_open },
        "follow_ups": { "pending": follow_ups_pending },
        "appointments": { "scheduled": appointments_scheduled }
    })))
}

fn filter(key: &str, value: &str) -> Vec<(String, String)> {
    vec![(key.to_string(), value.to_string())]
}
