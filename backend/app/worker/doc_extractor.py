from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from app.core.config import settings
from typing import Dict, Any, List

def get_document_client() -> DocumentAnalysisClient:
    """
    Initialize and return the DocumentAnalysisClient.
    """
    if not settings.AZURE_FORM_RECOGNIZER_ENDPOINT or not settings.AZURE_FORM_RECOGNIZER_KEY:
        raise ValueError("Azure Document Intelligence credentials are not set.")
    
    return DocumentAnalysisClient(
        endpoint=settings.AZURE_FORM_RECOGNIZER_ENDPOINT,
        credential=AzureKeyCredential(settings.AZURE_FORM_RECOGNIZER_KEY)
    )

def extract_document_data(file_content: bytes) -> Dict[str, Any]:
    """
    Extract fields and tables from a document using the prebuilt-document model.
    """
    client = get_document_client()
    
    # Analyze the document
    poller = client.begin_analyze_document("prebuilt-document", file_content)
    result = poller.result()

    extracted_data = {
        "content": result.content,
        "key_value_pairs": [],
        "tables": []
    }

    # Extract key-value pairs
    for kv_pair in result.key_value_pairs:
        if kv_pair.key and kv_pair.value:
            extracted_data["key_value_pairs"].append({
                "key": kv_pair.key.content,
                "value": kv_pair.value.content
            })

    # Extract tables
    for table in result.tables:
        table_data = []
        for cell in table.cells:
            table_data.append({
                "row_index": cell.row_index,
                "column_index": cell.column_index,
                "content": cell.content
            })
        extracted_data["tables"].append(table_data)

    return extracted_data
