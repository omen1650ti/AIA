from fastapi import APIRouter
from app.api.v1.endpoints import chat, providers, plans, riders, users, extraction, upload_document

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(providers.router, prefix="/providers", tags=["providers"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
api_router.include_router(riders.router, prefix="/riders", tags=["riders"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(extraction.router, prefix="/extraction", tags=["extraction"])
api_router.include_router(upload_document.router, prefix="/upload", tags=["upload"])

