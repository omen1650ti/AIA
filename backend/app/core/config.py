from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Chatbot"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+asyncpg://aiauser:aiapassword@localhost:5432/aiadatabase"

    # Azure Document Intelligence
    AZURE_FORM_RECOGNIZER_ENDPOINT: str = ""
    AZURE_FORM_RECOGNIZER_KEY: str = ""

    # Azure OpenAI
    ENDPOINT: str = ""
    MODEL_NAME: str = ""
    DEPLOYMENT: str = ""
    SUBSCRIPTION_KEY: str = ""
    API_VERSION: str = "2024-12-01-preview"
    

    class Config:
        env_file = ".env"

settings = Settings()
