pub const DEFAULT_LIMIT: i64 = 50;
pub const MAX_LIMIT: i64 = 200;

pub fn pagination(limit: Option<i64>, offset: Option<i64>) -> (i64, i64) {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).clamp(1, MAX_LIMIT);
    let offset = offset.unwrap_or(0).max(0);
    (limit, offset)
}

pub fn select(params: &mut Vec<(String, String)>, value: &str) {
    params.push(("select".to_string(), value.to_string()));
}

pub fn eq(params: &mut Vec<(String, String)>, key: &str, value: Option<&str>) {
    if let Some(value) = value {
        let value = value.trim();
        if !value.is_empty() {
            params.push((key.to_string(), format!("eq.{value}")));
        }
    }
}

pub fn gte(params: &mut Vec<(String, String)>, key: &str, value: Option<&str>) {
    if let Some(value) = value {
        let value = value.trim();
        if !value.is_empty() {
            params.push((key.to_string(), format!("gte.{value}")));
        }
    }
}

pub fn lte(params: &mut Vec<(String, String)>, key: &str, value: Option<&str>) {
    if let Some(value) = value {
        let value = value.trim();
        if !value.is_empty() {
            params.push((key.to_string(), format!("lte.{value}")));
        }
    }
}

pub fn search(params: &mut Vec<(String, String)>, fields: &[&str], term: Option<&str>) {
    if let Some(term) = term {
        let term = term.trim();
        if !term.is_empty() {
            let expression = fields
                .iter()
                .map(|field| format!("{field}.ilike.*{term}*"))
                .collect::<Vec<_>>()
                .join(",");
            params.push(("or".to_string(), format!("({expression})")));
        }
    }
}

pub fn order(params: &mut Vec<(String, String)>, value: Option<&str>, default: &str) {
    params.push(("order".to_string(), value.unwrap_or(default).to_string()));
}

pub fn page(params: &mut Vec<(String, String)>, limit: i64, offset: i64) {
    params.push(("limit".to_string(), limit.to_string()));
    params.push(("offset".to_string(), offset.to_string()));
}
