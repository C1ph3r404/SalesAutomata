use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{Appointment, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListAppointmentsQuery {
    pub lead_id: Option<String>,
    pub agent_id: Option<String>,
    pub property_id: Option<String>,
    pub status: Option<String>,
    pub appointment_type: Option<String>,
    pub upcoming: Option<bool>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListAppointmentsQuery>,
) -> Result<Json<ListResponse<Appointment>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "lead_id", query.lead_id.as_deref());
    query::eq(&mut params, "agent_id", query.agent_id.as_deref());
    query::eq(&mut params, "property_id", query.property_id.as_deref());
    query::eq(&mut params, "status", query.status.as_deref());
    query::eq(
        &mut params,
        "appointment_type",
        query.appointment_type.as_deref(),
    );
    if query.upcoming.unwrap_or(false) {
        params.push(("scheduled_at".to_string(), "gte.now()".to_string()));
    }
    query::order(&mut params, query.order.as_deref(), "scheduled_at.asc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("appointments", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}
