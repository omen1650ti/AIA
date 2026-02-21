import React, { useState } from "react";
import { S } from "../InsurancePage/styles/theme";
import DocumentUpload from "./components/DocumentUpload";
import AnalysisResult from "./components/AnalysisResult";
import { useClaimReview } from "../../hooks/useClaimReview";

const REQUIRED_DOCS =[
  "Aadhar Card",
  "Plan Document",
  "Discharge Summary",
  "Medical Certificate",
  "Bill"
]
function ClaimReviewer() {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const { mutate: runAnalysis, data: analysisResult, isPending, isSuccess, reset } = useClaimReview();

  const handleUpload = (docName, file) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docName]: file
    }));
  };

  const handleRunAnalysis = () => {
    runAnalysis({ docs: uploadedDocs });
  };

  const allDocsUploaded = REQUIRED_DOCS.every(doc => uploadedDocs[doc]);

  return (
    <div style={{
      padding: "40px 32px",
      maxWidth: "1300px",
      margin: "0 auto",
      color: S.text,
      height: "100%",
      overflowY: "auto"
    }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0" }}>Claim Reviewer</h1>
        <p style={{ color: S.textSub, fontSize: 16 }}>
          Upload your documents below to get an AI-powered analysis of your claim's approval likelihood.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Uploads Section */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Required Documents</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {REQUIRED_DOCS.map(doc => (
              <DocumentUpload 
                key={doc} 
                name={doc} 
                onUpload={(file) => handleUpload(doc, file)}
                isUploaded={!!uploadedDocs[doc]}
              />
            ))}
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={!allDocsUploaded || isPending}
            style={{
              marginTop: 32,
              width: "100%",
              padding: "18px",
              background: allDocsUploaded ? S.purpleGrad : "#e2e8f0",
              color: allDocsUploaded ? "white" : "#94a3b8",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: allDocsUploaded ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: allDocsUploaded ? "0 4px 15px rgba(124,58,237,0.25)" : "none"
            }}
          >
            {isPending ? "Analyzing Claim Documents..." : "Run Comprehensive AI Audit"}
          </button>
        </div>

        {/* Results Section */}
        { (isPending || isSuccess) && (
          <div style={{ width: "100%", marginTop: 16 }}>
            <AnalysisResult 
              result={analysisResult} 
              isLoading={isPending} 
              isSuccess={isSuccess}
              onReset={() => {
                  setUploadedDocs({});
                  reset();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimReviewer;
