import React from "react";
import BouncingLoader from "../../../components/BouncingLoader";
import { S } from "../../InsurancePage/styles/theme";

function AnalysisResult({ result, isLoading, isSuccess, onReset }) {
  const [msgIndex, setMsgIndex] = React.useState(0);
  
  const loadingMessages = [
    "Analyzing Aadhar Card for identity verification...",
    "Reviewing Insurance Plan Document for coverage details...",
    "Extracting information from Discharge Summary...",
    "Validating Medical Certificate with hospital records...",
    "Calculating final claim amount from bills and invoices...",
    "Running final AI cross-check on all documents..."
  ];

  React.useEffect(() => {
    let interval;
    if (isLoading) {
      setMsgIndex(0);
      interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 25000); // Cycle every 25s for ~2.5 mins total (6 messages)
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div style={{
        background: "white",
        border: `1px solid ${S.border}`,
        borderRadius: 20,
        padding: 40,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div className="mb-6">
          <BouncingLoader />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>AI Analysis in Progress</h3>
        <p style={{ color: S.textSub, fontSize: 14, maxWidth: 280, minHeight: "3em" }}>
          {loadingMessages[msgIndex]}
        </p>
        <div style={{ marginTop: 20, fontSize: 12, color: S.purple, fontWeight: 600 }}>
          This may take a few minutes...
        </div>
      </div>
    );
  }

  if (!isSuccess || !result) {
    return (
      <div style={{
        background: "#f8fafc",
        border: `2px dashed ${S.border}`,
        borderRadius: 20,
        padding: 40,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: S.textSub }}>Analysis Pending</h3>
        <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 220, marginTop: 8 }}>
          Upload all required documents to start the AI review.
        </p>
      </div>
    );
  }

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      let lineStyle = { fontSize: 13, color: S.textSub, margin: "4px 0", lineHeight: 1.6 };
      let headerStyle = { fontSize: 18, fontWeight: 800, margin: "24px 0 12px 0", color: S.text };
      let subHeaderStyle = { fontSize: 15, fontWeight: 700, margin: "16px 0 8px 0", color: S.purple };

      if (line.startsWith("### ")) {
        const title = line.replace("### ", "");
        return <h3 key={i} style={headerStyle}>{title}</h3>;
      }
      
      if (line.startsWith("#### ")) {
        const title = line.replace("#### ", "");
        const isRedFlag = title.toLowerCase().includes("red flag") || title.toLowerCase().includes("inconsistency");
        const isRecommendation = title.toLowerCase().includes("recommendation");
        const isClearMatch = title.toLowerCase().includes("clear match");

        return (
          <h4 key={i} style={{ 
            ...subHeaderStyle, 
            color: isRedFlag ? "#dc2626" : isRecommendation ? S.purple : isClearMatch ? "#16a34a" : S.purple,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            {isRedFlag && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            {title}
          </h4>
        );
      }

      if (line.startsWith("- **")) {
        const parts = line.split("**");
        const isAlert = parts[1].toLowerCase().includes("discrepancy") || parts[1].toLowerCase().includes("flag");
        return (
          <div key={i} style={{ display: "flex", gap: 8, margin: "8px 0", fontSize: 13, lineHeight: 1.5 }}>
            <span style={{ color: isAlert ? "#dc2626" : S.purple, marginTop: 4 }}>•</span>
            <span><strong style={{ color: isAlert ? "#991b1b" : S.text }}>{parts[1]}</strong>{parts.slice(2).join("")}</span>
          </div>
        );
      }
      if (line.startsWith("  - ")) return <div key={i} style={{ marginLeft: 20, fontSize: 13, color: S.textSub, margin: "4px 0" }}>• {line.replace("  - ", "")}</div>;
      if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
      return <p key={i} style={{ fontSize: 13, color: S.textSub, margin: "4px 0", lineHeight: 1.6 }}>{line}</p>;
    });
  };

  const DataSection = ({ title, data }) => (
    <div style={{ marginBottom: 20 }}>
      <h5 style={{ fontSize: 12, fontWeight: 800, color: S.textMuted, textTransform: "uppercase", marginBottom: 10, letterSpacing: 0.5 }}>{title}</h5>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", background: "#f8fafc", padding: 16, borderRadius: 12, border: "1px solid #f1f5f9" }}>
        {Object.entries(data).map(([key, val]) => (
          <div key={key} style={{ fontSize: 12 }}>
            <span style={{ color: S.textSub, fontWeight: 500 }}>{key}</span>
            <div style={{ color: S.text, fontWeight: 600, marginTop: 2 }}>{String(val)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      background: "white",
      border: `1px solid ${S.border}`,
      borderRadius: 24,
      padding: 0,
      boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Scrollable Content */}
      <div style={{ padding: 32, overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <span style={{ 
              fontSize: 11, fontWeight: 800, background: "#fef2f2", color: "#dc2626", 
              padding: "4px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: 1
            }}>
              Audit Complete
            </span>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginTop: 12, marginBottom: 4 }}>
              Claim Analysis
            </h2>
            <p style={{ fontSize: 14, color: S.textSub }}>Status: <span style={{ fontWeight: 700, color: "#dc2626" }}>Flagged for Review</span></p>
          </div>
          {/* <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: S.purple }}>High</div>
            <div style={{ fontSize: 12, color: S.textSub, fontWeight: 600 }}>Risk Level</div>
          </div> */}
        </div>

        {/* Audit Report Section */}
        <div style={{ 
          background: "#fff", border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 32,
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
        }}>
           <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={S.purple} strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              AI Auditor Insights
           </h4>
           {renderMarkdown(result.audit_report)}
        </div>

        {/* Extracted Data Transparency Section */}
        <div style={{ marginBottom: 24 }}>
           <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={S.purple} strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Extracted Evidence
           </h4>
           
           {/* Identity & Plan */}
           {result.identity_and_plan && Object.entries(result.identity_and_plan).map(([filename, doc]) => (
             <DataSection key={filename} title={`${doc.doc_type} (${filename})`} data={doc.data} />
           ))}

           {/* Clinical */}
           {result.clinical_records && Object.entries(result.clinical_records).map(([filename, doc]) => (
             <DataSection key={filename} title={`${doc.doc_type} (${filename})`} data={doc.data} />
           ))}

           {/* Hospital Bill */}
           {result.hospital_bill && Object.entries(result.hospital_bill).map(([filename, doc]) => (
             <DataSection key={filename} title={`${doc.doc_type} (${filename})`} data={doc.data} />
           ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ padding: "24px 32px", borderTop: `1px solid ${S.border}`, background: "#fafbfc" }}>
        <button
          onClick={onReset}
          style={{
            width: "100%",
            padding: "16px",
            background: "white",
            color: S.text,
            border: `1px solid ${S.border}`,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          Reset & Start New Audit
        </button>
      </div>
    </div>
  );
}

export default AnalysisResult;
