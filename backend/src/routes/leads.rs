use axum::{
    Json,
    extract::{Path, Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{Lead, LeadDetail, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListLeadsQuery {
    pub status: Option<String>,
    pub source: Option<String>,
    pub city: Option<String>,
    pub assigned_agent_id: Option<String>,
    pub min_score: Option<i32>,
    pub search: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListLeadsQuery>,
) -> Result<Json<ListResponse<Lead>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "status", query.status.as_deref());
    query::eq(&mut params, "source", query.source.as_deref());
    query::eq(&mut params, "preferred_city", query.city.as_deref());
    query::eq(
        &mut params,
        "assigned_agent_id",
        query.assigned_agent_id.as_deref(),
    );
    if let Some(score) = query.min_score {
        query::gte(&mut params, "qualification_score", Some(&score.to_string()));
    }
    query::search(
        &mut params,
        &["name", "phone", "email", "preferred_locality"],
        query.search.as_deref(),
    );
    query::order(&mut params, query.order.as_deref(), "created_at.desc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("leads", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}

pub async fn get_one(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<LeadDetail>, AppError> {
    let mut params = Vec::new();
    query::select(
        &mut params,
        "*,agents(*),conversations(*),appointments(*),follow_ups(*),lead_activities(*)",
    );
    params.push(("id".to_string(), format!("eq.{id}")));
    params.push(("limit".to_string(), "1".to_string()));
    params.push((
        "conversations.order".to_string(),
        "started_at.desc".to_string(),
    ));
    params.push((
        "appointments.order".to_string(),
        "scheduled_at.asc".to_string(),
    ));
    params.push(("follow_ups.order".to_string(), "due_at.asc".to_string()));
    params.push((
        "lead_activities.order".to_string(),
        "created_at.desc".to_string(),
    ));

    let (value, _) = state.supabase.list("leads", &params).await?;
    let mut items: Vec<LeadDetail> = serde_json::from_value(value)?;

    items.pop().map(Json).ok_or(AppError::NotFound)
}
