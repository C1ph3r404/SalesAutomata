use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{FollowUp, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListFollowUpsQuery {
    pub lead_id: Option<String>,
    pub status: Option<String>,
    pub channel: Option<String>,
    pub due_before: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListFollowUpsQuery>,
) -> Result<Json<ListResponse<FollowUp>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "lead_id", query.lead_id.as_deref());
    query::eq(&mut params, "status", query.status.as_deref());
    query::eq(&mut params, "channel", query.channel.as_deref());
    query::lte(&mut params, "due_at", query.due_before.as_deref());
    query::order(&mut params, query.order.as_deref(), "due_at.asc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("follow_ups", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}
