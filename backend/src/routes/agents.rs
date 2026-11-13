use axum::{
    Json,
    extract::{Path, Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{Agent, AgentDetail, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListAgentsQuery {
    pub is_active: Option<bool>,
    pub search: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListAgentsQuery>,
) -> Result<Json<ListResponse<Agent>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    if let Some(active) = query.is_active {
        params.push(("is_active".to_string(), format!("eq.{active}")));
    }
    query::search(
        &mut params,
        &["name", "phone", "email", "specialization"],
        query.search.as_deref(),
    );
    query::order(&mut params, query.order.as_deref(), "name.asc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("agents", &params).await?;
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
) -> Result<Json<AgentDetail>, AppError> {
    let mut params = Vec::new();
    query::select(&mut params, "*,leads(*)");
    params.push(("id".to_string(), format!("eq.{id}")));
    params.push(("limit".to_string(), "1".to_string()));
    params.push(("leads.order".to_string(), "created_at.desc".to_string()));

    let (value, _) = state.supabase.list("agents", &params).await?;
    let mut items: Vec<AgentDetail> = serde_json::from_value(value)?;

    items.pop().map(Json).ok_or(AppError::NotFound)
}
