from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from app.core.config import settings
from typing import Dict, Any, List

def get_document_client() -> DocumentAnalysisClient:
    """
    Initialize and return the DocumentAnalysisClient.
    """
    print("prrr", AZURE_FORM_RECOGNIZER_ENDPOINT)
    if not AZURE_FORM_RECOGNIZER_ENDPOINT or not AZURE_FORM_RECOGNIZER_KEY:
        raise ValueError("Azure Document Intelligence credentials are not set.")
    
    return DocumentAnalysisClient(
        endpoint=AZURE_FORM_RECOGNIZER_ENDPOINT,
        credential=AzureKeyCredential(AZURE_FORM_RECOGNIZER_KEY)
    )

def extract_document_data(file_content: bytes, filename: str = "") -> Dict[str, Any]:
    """
    Extract fields and tables from a document and process based on the doc_type inferred from the filename.
    """
    doc_type = get_doc_type_from_filename(filename)
    print("doc_type11", doc_type) 
    client = get_document_client()
    
    # Analyze the document
    poller = client.begin_analyze_document("prebuilt-document", file_content)
    result = poller.result()
    
    raw_data = {
        "content": result.content,
        "key_value_pairs": {kv.key.content: kv.value.content for kv in result.key_value_pairs if kv.key and kv.value},
        "tables": []
    }

    for table in result.tables:
        table_rows = []
        for cell in table.cells:
            table_rows.append({
                "row": cell.row_index,
                "col": cell.column_index,
                "content": cell.content
            })
        raw_data["tables"].append(table_rows)

    # Dispatch to specialized logic
    if doc_type == "aadhar_card":
        return extract_aadhar_data(raw_data)
    elif doc_type == "plan_document":
        return extract_plan_data(raw_data)
    elif doc_type == "discharge_summary":
        return extract_discharge_summary_data(raw_data)
    elif doc_type == "medical_certificate":
        return extract_medical_certificate_data(raw_data)
    elif doc_type == "bill":
        return extract_bill_data(raw_data)
    else:
        return {
            "doc_type": "generic",
            "data": raw_data["key_value_pairs"],
            "text_content": raw_data["content"],
            "tables": raw_data["tables"]
        }

def get_doc_type_from_filename(filename: str) -> str:
    """
    Infer document type from filename keywords.
    """
    filename = filename.lower()
    if any(keyword in filename for keyword in ["aadhar", "id"]):
        return "aadhar_card"
    elif any(keyword in filename for keyword in ["plan", "policy", "insurance"]):
        return "plan_document"
    elif any(keyword in filename for keyword in ["discharge", "summary"]):
        return "discharge_summary"
    elif any(keyword in filename for keyword in ["certificate", "medical"]):
        return "medical_certificate"
    elif any(keyword in filename for keyword in ["bill", "invoice", "receipt"]):
        return "bill"
    return "generic"

def extract_aadhar_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    # Logic for Aadhar Card
    return {
        "doc_type": "aadhar_card",
        "data": raw_data["key_value_pairs"],
        "text_content": raw_data["content"]
    }

def extract_plan_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    # Logic for Plan Document
    return {
        "doc_type": "plan_document",
        "data": raw_data["key_value_pairs"],
        "text_content": raw_data["content"]
    }

def extract_discharge_summary_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    # Logic for Discharge Summary
    return {
        "doc_type": "discharge_summary",
        "data": raw_data["key_value_pairs"],
        "text_content": raw_data["content"]
    }

def extract_medical_certificate_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    # Logic for Medical Certificate
    return {
        "doc_type": "medical_certificate",
        "data": raw_data["key_value_pairs"],
        "text_content": raw_data["content"]
    }

def extract_bill_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    # Logic for Bill
    return {
        "doc_type": "bill",
        "data": raw_data["key_value_pairs"],
        "text_content": raw_data["content"]
    }
