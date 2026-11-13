use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{LeadActivity, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListActivitiesQuery {
    pub lead_id: Option<String>,
    pub activity_type: Option<String>,
    pub created_by: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListActivitiesQuery>,
) -> Result<Json<ListResponse<LeadActivity>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "lead_id", query.lead_id.as_deref());
    query::eq(&mut params, "activity_type", query.activity_type.as_deref());
    query::eq(&mut params, "created_by", query.created_by.as_deref());
    query::order(&mut params, query.order.as_deref(), "created_at.desc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("lead_activities", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}
