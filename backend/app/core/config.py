from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "SKARWORLD REVENUE OS API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = "skarworld-super-secret-key-development-minimum-32-chars-long"
    JWT_SECRET_KEY: str = "skarworld-jwt-secret-key-development-minimum-32-chars-long"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours in dev
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database & Redis
    DATABASE_URL: str = "sqlite+aiosqlite:///./skarworld.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://skarworld-frontend.onrender.com",
    ]
    
    # AI & Integrations
    ANTHROPIC_API_KEY: str = ""
    TAVILY_API_KEY: str = ""
    BRAVE_SEARCH_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
