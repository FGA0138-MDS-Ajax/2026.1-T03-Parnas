from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    POSTGRES_USER: str = "keepunb"
    POSTGRES_PASSWORD: str = "changeme"
    POSTGRES_DB: str = "keepunb_dev"
    DATABASE_URL: str = "postgresql+asyncpg://keepunb:changeme@db:5432/keepunb_dev"
    
    SECRET_KEY: str = "changeme-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
