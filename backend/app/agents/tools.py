"""Tools for the insurance agent."""

import json
from typing import Any, Dict, List, Optional
from datetime import datetime
import difflib
import re
import os
import smtplib
from email.message import EmailMessage
import base64
import httpx
from openai import AsyncAzureOpenAI
from app.core.config import settings
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from langchain_core.tools import tool
from pinecone import PineconeAsyncio

from app.core.config import settings

import asyncio


from functools import lru_cache


@lru_cache(maxsize=1)
def get_pinecone_index():
    return pc_asyncio.IndexAsyncio(
        host=settings.PINECONE_HOST_URL,
        name=settings.PINECONE_INDEX_NAME,
    )

async_openai_embedding_client = AsyncAzureOpenAI(
    api_key=settings.EMBEDDING_KEY,
    azure_endpoint=settings.EMBEDDING_ENDPOINT,
    api_version=settings.EMBEDDING_VERSION,
)

pc_asyncio = PineconeAsyncio(api_key=settings.PINECONE_API_KEY)


@tool
async def general_similarity_search(query: str) -> List[str]:
    """
    Performs a semantic similarity search using Pinecone with OpenAI embeddings.
    Returns a list of relevant content chunks.
    """
    try:
        # start timer
        start_time = datetime.now()
        # Embed the input query
        vector_response = await async_openai_embedding_client.embeddings.create(
            model="text-embedding-ada-002", input=query
        )

        query_vector = vector_response.data[0].embedding
        index = get_pinecone_index()
        
        response = await index.query_namespaces(
            vector=query_vector,
            namespaces=[
                settings.PINECONE_NAMESPACE,
            ],
            top_k=3,
            include_metadata=True,
            metric="cosine",
        )

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        print(f"Similarity search took {duration} seconds")

        matches = response.matches or []
        if not matches:
            return ["No relevant results found."]

        # Build result content
        # TODO In the metadata keep plan name, provider name
        contents = [
                f"Chunk: {m.metadata.get('chunk', 'N/A')}"
                for m in matches
        ]

        print("Count of contents from similarity search:", len(contents))

        return contents

    except Exception as e:
        return [f"Error in similarity search: {str(e)}"]
    finally:
        _ = asyncio.create_task(pc_asyncio.close())


def dispute_settlement(
    policy_id: str,
    complaint_text: str,
    claim_doc_url: Optional[str] = None,
    provider_email: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Escalate a customer dispute/complaint to the insurance provider via email.
    
    Composes and sends an email notification to the insurance provider containing
    the customer's complaint details and optionally reference to document/claim URLs.
    Uses SMTP configuration from environment variables.
    
    Args:
        policy_id: The policy ID associated with the dispute
        complaint_text: The customer's complaint or dispute description
        claim_doc_url: Optional URL to supporting documentation
        provider_email: Optional specific provider email; uses default if not provided
    
    Returns:
        Dictionary containing:
        - 'status': 'success' or 'error'
        - 'sent_to': Email address to which complaint was sent
        - 'message': Status message
        - 'error': Error details if status is 'error'
    
    Environment Variables Required:
        - EMAIL_FROM: Sender email address
        - EMAIL_TO_DEFAULT: Default recipient email if provider_email not specified
        - SMTP_HOST: SMTP server hostname
        - SMTP_PORT: SMTP server port
        - SMTP_USER: SMTP authentication username (optional, for auth)
        - SMTP_PASS: SMTP authentication password (optional, for auth)
    
    Note:
        This is a synchronous operation. Consider async wrappers if used in
        async contexts to prevent blocking.
    """
    try:
        # Compose email
        from_addr = os.getenv("EMAIL_FROM", "noreply@example.com")
        default_to = os.getenv("EMAIL_TO_DEFAULT", "provider@example.com")
        to_addr = provider_email or default_to

        subject = f"Dispute/Complaint for Policy {policy_id}"
        body = f"Policy: {policy_id}\n\nComplaint:\n{complaint_text}\n\nDocument: {claim_doc_url or 'None'}"

        # Use smtplib to send a simple email
        msg = EmailMessage()
        msg["From"] = from_addr
        msg["To"] = to_addr
        msg["Subject"] = subject
        msg.set_content(body)

        smtp_host = os.getenv("SMTP_HOST", "localhost")
        smtp_port = int(os.getenv("SMTP_PORT", "25"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")

        if smtp_user and smtp_pass:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
        else:
            # Try sending without auth
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.send_message(msg)
            server.quit()

        return {"status": "success", "sent_to": to_addr, "message": "Complaint email sent"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# Tool registry for LangChain
TOOLS = [
    {"name": "dispute_settlement", "function": dispute_settlement, "description": "Escalate a customer dispute to the insurance provider via email with complaint details."},
    {"name": "general_similarity_search", "function": general_similarity_search, "description": "Perform a semantic similarity search to retrieve relevant policy/plan information based on user query."},

]
