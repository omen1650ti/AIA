import React from "react";
import { S } from "../styles/theme";
import { useNavigate } from "react-router-dom";

function GridPolicyCard({ p }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: S.white,
        border: `1px solid ${S.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.10)";
        e.currentTarget.style.borderColor = S.purpleMid;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = S.border;
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h3
          style={{ fontSize: 14, fontWeight: 700, color: S.purple, margin: 0 }}
        >
          {p.name}
        </h3>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            background: S.purpleLight,
            color: S.purple,
            borderRadius: 20,
            border: `1px solid ${S.purpleMid}`,
          }}
        >
          {p.type}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          ["Premium", `$${p.premium}/mo`],
          ["Age Range", `${p.minAge} – ${p.maxAge}`],
          ["Coverage", `$${p.coverage.toLocaleString()}`],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: S.textSub }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.text }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <button
        style={{
          marginTop: 12,
          width: "100%",
          padding: "8px 0",
          background: S.purpleLight,
          border: `1px solid ${S.purpleMid}`,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: S.purple,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#ddd6fe")}
        onMouseLeave={(e) => (e.currentTarget.style.background = S.purpleLight)}
        onClick={() => navigate(`/policy-details/${p.id}`)}
      >
        View Details
      </button>
    </div>
  );
}

export default GridPolicyCard;
