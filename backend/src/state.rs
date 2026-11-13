use std::sync::Arc;

use crate::supabase::Supabase;

#[derive(Clone)]
pub struct AppState {
    pub supabase: Arc<Supabase>,
}
