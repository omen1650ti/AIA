import BouncingLoader from "../../../components/BouncingLoader";
import { S } from "../../InsurancePage/styles/theme";

function AnalysisResult({ result, isLoading, isSuccess, onReset }) {
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
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Analyzing Documents...</h3>
        <p style={{ color: S.textSub, fontSize: 14, maxWidth: 280 }}>
          Our AI is cross-referencing your documents with policy terms and historical data.
        </p>
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

  return (
    <div style={{
      background: "white",
      border: `1px solid ${S.border}`,
      borderRadius: 20,
      padding: 32,
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <span style={{ 
            fontSize: 11, 
            fontWeight: 800, 
            background: "#ecfdf5", 
            color: "#059669", 
            padding: "4px 10px", 
            borderRadius: 6,
            textTransform: "uppercase",
            letterSpacing: 1
          }}>
            Analysis Complete
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 12, marginBottom: 4 }}>
            Likelihood: <span style={{ color: "#10b981" }}>{result.status}</span>
          </h2>
          <p style={{ fontSize: 14, color: S.textSub }}>Ref: {result.id}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: S.purple }}>{result.score}%</div>
          <div style={{ fontSize: 12, color: S.textSub, fontWeight: 600 }}>Confidence Score</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Key Findings
        </h4>
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {result.analysis.map((point, i) => (
            <li key={i} style={{ 
              fontSize: 13, 
              color: S.text, 
              padding: "8px 0", 
              borderBottom: i === result.analysis.length - 1 ? "none" : `1px solid ${S.bg}`,
              display: "flex",
              alignItems: "flex-start",
              gap: 10
            }}>
              <span style={{ marginTop: 6, width: 4, height: 4, borderRadius: "50%", background: S.purple, shrink: 0 }}></span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 32, background: "#f5f3ff", padding: 20, borderRadius: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: S.purple }}>Recommendations</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {result.recommendations.map((rec, i) => (
            <div key={i} style={{ fontSize: 13, color: "#5b21b6", display: "flex", gap: 8 }}>
              <b>•</b> {rec}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          width: "100%",
          padding: "14px",
          background: "white",
          color: S.text,
          border: `1px solid ${S.border}`,
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        Start New Analysis
      </button>
    </div>
  );
}

export default AnalysisResult;
