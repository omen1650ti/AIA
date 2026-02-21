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
      maxWidth: "1000px",
      margin: "0 auto",
      color: S.text
    }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0" }}>Claim Reviewer</h1>
        <p style={{ color: S.textSub, fontSize: 16 }}>
          Upload your documents below to get an AI-powered analysis of your claim's approval likelihood.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Left Column: Uploads */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Required Documents</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              marginTop: 24,
              width: "100%",
              padding: "16px",
              background: allDocsUploaded ? S.purpleGrad : "#e2e8f0",
              color: allDocsUploaded ? "white" : "#94a3b8",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: allDocsUploaded ? "pointer" : "not-allowed",
              transition: "all 0.2s"
            }}
          >
            {isPending ? "Analyzing Claim..." : "Run AI Analysis"}
          </button>
        </div>

        {/* Right Column: Results */}
        <div>
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
      </div>
    </div>
  );
}

export default ClaimReviewer;
