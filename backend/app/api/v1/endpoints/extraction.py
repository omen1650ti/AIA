from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any
from app.worker.doc_extractor import extract_document_data

router = APIRouter()

@router.post("/upload", response_model=List[Dict[str, Any]])
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload multiple files and extract data using Azure Document Intelligence.
    """
    results = []
    
    for file in files:
        try:
            content = await file.read()
            extracted_data = extract_document_data(content)
            results.append({
                "filename": file.filename,
                "status": "success",
                "data": extracted_data
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e)
            })
            
    return results
