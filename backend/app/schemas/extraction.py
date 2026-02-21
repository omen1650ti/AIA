from pydantic import BaseModel
from typing import List, Dict, Any

class ExtractionResult(BaseModel):
    identity_and_plan: Dict[str, Any]
    clinical_records: Dict[str, Any]
    audit_report: str
