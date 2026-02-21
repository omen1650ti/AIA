from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.agents.core import get_agent_manager
from app.core.checkpointer import AsyncPostgresPool
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title=settings.PROJECT_NAME)

# --- Add CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Allows all origins
    allow_credentials=False,  # Must be False if allow_origins is ["*"]
    allow_methods=["*"],      # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],      # Allows all headers
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup_event():
    """Initialize agent manager and checkpoint pool on app startup."""
    try:
        logger.info("Initializing agent manager...")
        await get_agent_manager()
        logger.info("Agent manager initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize agent manager: {e}", exc_info=True)


@app.on_event("shutdown")
async def shutdown_event():
    """Close the connection pool on app shutdown."""
    try:
        logger.info("Closing database connection pool...")
        await AsyncPostgresPool.close_pool()
        logger.info("Connection pool closed")
    except Exception as e:
        logger.error(f"Error closing connection pool: {e}", exc_info=True)


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Chatbot"}