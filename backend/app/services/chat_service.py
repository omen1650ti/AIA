from app.schemas.chat import ChatRequest, ChatResponse

class ChatService:
    @staticmethod
    async def process_message(request: ChatRequest) -> ChatResponse:
        # Placeholder for actual chatbot logic (e.g., calling OpenAI, etc.)
        return ChatResponse(response=f"Echo: {request.message}")
