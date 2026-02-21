import json
from openai import AzureOpenAI
from app.core.config import settings
from typing import Dict, Any

class AuditService:
    @staticmethod
    async def analyze_document_inconsistencies(dataset: Dict[str, Any]) -> str:
        """
        Passes extracted document data to Azure OpenAI to detect inconsistencies,
        fraud flags, or mismatches across medical and identity documents.
        """
        
        # Initialize the Azure OpenAI client
        client = AzureOpenAI(
            azure_endpoint=settings.ENDPOINT,
            api_key=settings.SUBSCRIPTION_KEY,
            api_version=settings.API_VERSION
        )

        # Convert the dataset to a readable JSON string for the prompt
        dataset_str = json.dumps(dataset, indent=2)

        # Define the system prompt (The "Auditor Persona")
        system_prompt = """
        You are an expert Medical Insurance Claims Investigator and Forensic Auditor. 
        Your job is to thoroughly cross-reference data from multiple documents provided in JSON format and flag any inconsistencies, mismatches, or suspicious data points.

        Please analyze the provided dataset containing:
        1. Discharge Summary
        2. Aadhar Card (ID)
        3. Insurance Plan Document
        4. Hospital Bill
        5. Medical Certificate

        Pay strict attention to the following cross-checks:
        - Demographic consistency: Do Name, Age/DOB, and Address match perfectly across all docs?
        - Insurance Details: Does the Policy Number and Insurance Provider name on the Hospital Bill/Discharge Summary match the actual Insurance Plan Document provided?
        - Timeline validation: Do the Admission/Discharge dates and times match across the Hospital Bill, Discharge Summary, and Medical Certificate?
        - Financials: Does the billed amount logically align with the lengths of stay?

        Output a structured report with:
        1. **Clear Matches**: What data aligns perfectly.
        2. **Red Flags / Inconsistencies**: Bullet points of exact mismatches (e.g., "Document A says X, but Document B says Y").
        3. **Recommendation**: Should this claim be flagged for manual review?
        """

        user_prompt = f"Here is the extracted document data to analyze:\n\n{dataset_str}"

        try:
            # Call the Azure OpenAI deployment
            # Note: client.chat.completions.create is synchronous in the basic openai library
            # To be truly async we might need to run in executor, but for this hackathon context 
            # we'll keep it simple as the user provided.
            response = client.chat.completions.create(
                model=settings.DEPLOYMENT,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1, # Low temperature for analytical, factual output
                max_tokens=1000
            )
            
            return response.choices[0].message.content

        except Exception as e:
            return f"An error occurred during consistency analysis: {str(e)}"
