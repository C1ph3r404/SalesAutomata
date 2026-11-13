use anyhow::{Context, Result};

pub struct Config {
    pub port: u16,
    pub supabase_url: String,
    pub supabase_service_role_key: String,
    pub cors_origin: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let supabase_url = std::env::var("SUPABASE_URL")
            .unwrap_or_else(|_| "https://iaydmzkytlksabwuylsl.supabase.co".to_string());

        let supabase_service_role_key = std::env::var("SUPABASE_SERVICE_ROLE_KEY")
            .or_else(|_| std::env::var("SUPABASE_KEY"))
            .context(
                "SUPABASE_SERVICE_ROLE_KEY is required. Use the project's service_role key; it is only read server-side.",
            )?;

        let port = std::env::var("PORT")
            .ok()
            .and_then(|value| value.parse().ok())
            .unwrap_or(8080);

        let cors_origin = std::env::var("CORS_ORIGIN").unwrap_or_else(|_| "*".to_string());

        Ok(Self {
            port,
            supabase_url,
            supabase_service_role_key,
            cors_origin,
        })
    }
}
