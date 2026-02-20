from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

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

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Chatbot"}