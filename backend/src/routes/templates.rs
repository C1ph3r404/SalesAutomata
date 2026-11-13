use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{ListResponse, MessageTemplate},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListTemplatesQuery {
    pub category: Option<String>,
    pub is_active: Option<bool>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListTemplatesQuery>,
) -> Result<Json<ListResponse<MessageTemplate>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "category", query.category.as_deref());
    if let Some(active) = query.is_active {
        params.push(("is_active".to_string(), format!("eq.{active}")));
    }
    query::order(&mut params, query.order.as_deref(), "name.asc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("message_templates", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}
