from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Chatbot"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+asyncpg://aiauser:aiapassword@localhost:5432/aiadatabase"

    # Azure Document Intelligence
    AZURE_FORM_RECOGNIZER_ENDPOINT: str
    AZURE_FORM_RECOGNIZER_KEY: str

    # Azure OpenAI
    ENDPOINT: str = ""
    MODEL_NAME: str = ""
    DEPLOYMENT: str = ""
    SUBSCRIPTION_KEY: str = ""
    API_VERSION: str = "2024-12-01-preview"

    AZURE_OPENAI_API_KEY: str = ""
    AZURE_OPENAI_ENDPOINT: str = ""
    AZURE_OPENAI_API_VERSION: str = "2024-12-01-preview"
    AZURE_OPENAI_DEPLOYMENT: str = ""

    EMBEDDING_ENDPOINT: str = ""
    EMBEDDING_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    EMBEDDING_VERSION: str = "2023-05-15"
    
    PINECONE_API_KEY: str = ""
    PINECONE_HOST_URL: str = ""
    PINECONE_INDEX_NAME: str = ""
    PINECONE_NAMESPACE: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
