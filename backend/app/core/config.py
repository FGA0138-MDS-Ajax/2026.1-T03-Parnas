from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    POSTGRES_USER: str = "keepunb"
    POSTGRES_PASSWORD: str = "changeme"
    POSTGRES_DB: str = "keepunb_dev"
    DATABASE_URL: str = "postgresql+asyncpg://keepunb:changeme@db:5432/keepunb_dev"
    TEST_DATABASE_URL: str = "postgresql+asyncpg://keepunb:changeme@db_test:5432/keepunb_test"
    
    SECRET_KEY: str = "changeme-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "contato.udrive@gmail.com"
    SMTP_PASSWORD: str = "ubmxoqydacerbysj"
    SMTP_FROM: str = "contato.udrive@gmail.com"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
