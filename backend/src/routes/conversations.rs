use axum::{
    Json,
    extract::{Path, Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{Conversation, ConversationDetail, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListConversationsQuery {
    pub lead_id: Option<String>,
    pub status: Option<String>,
    pub channel: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListConversationsQuery>,
) -> Result<Json<ListResponse<Conversation>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "lead_id", query.lead_id.as_deref());
    query::eq(&mut params, "status", query.status.as_deref());
    query::eq(&mut params, "channel", query.channel.as_deref());
    query::order(&mut params, query.order.as_deref(), "started_at.desc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("conversations", &params).await?;
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
) -> Result<Json<ConversationDetail>, AppError> {
    let mut params = Vec::new();
    query::select(&mut params, "*,leads(*),messages(*)");
    params.push(("id".to_string(), format!("eq.{id}")));
    params.push(("limit".to_string(), "1".to_string()));
    params.push(("messages.order".to_string(), "created_at.asc".to_string()));

    let (value, _) = state.supabase.list("conversations", &params).await?;
    let mut items: Vec<ConversationDetail> = serde_json::from_value(value)?;

    items.pop().map(Json).ok_or(AppError::NotFound)
}
