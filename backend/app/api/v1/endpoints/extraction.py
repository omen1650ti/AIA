from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any
from app.worker.doc_extractor import extract_document_data, get_doc_type_from_filename
from app.schemas.extraction import ExtractionResult
from app.services.audit_service import AuditService

router = APIRouter()

@router.post("/upload", response_model=ExtractionResult)
async def upload_documents(
    files: List[UploadFile] = File(...)
):
    """
    Upload multiple files, extract data, and perform inconsistency analysis.
    """
    identity_and_plan = {}
    clinical_records = {}
    
    for file in files:
        try:
            content = await file.read()
            doc_type = get_doc_type_from_filename(file.filename)
            extracted_data = extract_document_data(content, filename=file.filename)
            
            # Grouping logic
            if doc_type in ["aadhar_card", "plan_document"]:
                identity_and_plan[file.filename] = extracted_data
            elif doc_type in ["discharge_summary", "medical_certificate", "bill"]:
                clinical_records[file.filename] = extracted_data
            else:
                identity_and_plan[file.filename] = extracted_data

        except Exception as e:
            error_data = {"status": "error", "message": str(e)}
            if "error_log" not in identity_and_plan:
                identity_and_plan["error_log"] = []
            identity_and_plan["error_log"].append({file.filename: error_data})
    
    # Perform inconsistency analysis across all extracted data
    dataset = {
        "identity_and_plan": identity_and_plan,
        "clinical_records": clinical_records
    }
    audit_report = await AuditService.analyze_document_inconsistencies(dataset)
            
    return ExtractionResult(
        identity_and_plan=identity_and_plan,
        clinical_records=clinical_records,
        audit_report=audit_report
    )
