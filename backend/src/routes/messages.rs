use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{ListResponse, Message},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListMessagesQuery {
    pub lead_id: Option<String>,
    pub conversation_id: Option<String>,
    pub direction: Option<String>,
    pub sender: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListMessagesQuery>,
) -> Result<Json<ListResponse<Message>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "lead_id", query.lead_id.as_deref());
    query::eq(
        &mut params,
        "conversation_id",
        query.conversation_id.as_deref(),
    );
    query::eq(&mut params, "direction", query.direction.as_deref());
    query::eq(&mut params, "sender", query.sender.as_deref());
    query::order(&mut params, query.order.as_deref(), "created_at.asc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("messages", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}
