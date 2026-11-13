use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;

use crate::{
    error::AppError,
    models::{InterestedLead, ListResponse},
    query,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct ListInterestedLeadsQuery {
    pub status: Option<String>,
    pub source: Option<String>,
    pub property_id: Option<String>,
    pub city: Option<String>,
    pub search: Option<String>,
    pub order: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListInterestedLeadsQuery>,
) -> Result<Json<ListResponse<InterestedLead>>, AppError> {
    let (limit, offset) = query::pagination(query.limit, query.offset);

    let mut params = Vec::new();
    query::select(&mut params, "*");
    query::eq(&mut params, "status", query.status.as_deref());
    query::eq(&mut params, "source", query.source.as_deref());
    query::eq(&mut params, "property_id", query.property_id.as_deref());
    query::eq(&mut params, "preferred_city", query.city.as_deref());
    query::search(
        &mut params,
        &["name", "phone", "email", "preferred_locality", "message"],
        query.search.as_deref(),
    );
    query::order(&mut params, query.order.as_deref(), "created_at.desc");
    query::page(&mut params, limit, offset);

    let (value, count) = state.supabase.list("interested_leads", &params).await?;
    let data = serde_json::from_value(value)?;

    Ok(Json(ListResponse {
        data,
        count,
        limit,
        offset,
    }))
}
