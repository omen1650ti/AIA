import React from "react";
import { S } from "../../InsurancePage/styles/theme";

function DocumentUpload({ name, onUpload, isUploaded }) {
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{
      background: "white",
      border: `1px solid ${isUploaded ? "#10b981" : S.border}`,
      borderRadius: 12,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.2s",
      boxShadow: isUploaded ? "0 2px 8px rgba(16, 185, 129, 0.1)" : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: isUploaded ? "#ecfdf5" : "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isUploaded ? "#10b981" : "#94a3b8"
        }}>
          {isUploaded ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          )}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: S.text }}>{name}</div>
          <div style={{ fontSize: 12, color: isUploaded ? "#059669" : S.textSub }}>
            {isUploaded ? "Ready for analysis" : "Required for submission"}
          </div>
        </div>
      </div>

      <label style={{
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        color: isUploaded ? "#10b981" : S.purple,
        background: isUploaded ? "#ecfdf5" : "transparent",
        padding: "6px 12px",
        borderRadius: 8,
        border: isUploaded ? "1px solid #10b981" : "none",
        transition: "all 0.2s"
      }}>
        {isUploaded ? "Replace" : "Upload"}
        <input 
          type="file" 
          style={{ display: "none" }} 
          onChange={handleChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </label>
    </div>
  );
}

export default DocumentUpload;
