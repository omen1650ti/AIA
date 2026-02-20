import React from 'react';
import { CheckIcon } from "./Icons";
import { S } from "../styles/theme";

function PolicyCard({ p }) {
  return (
    <div style={{
      background:   S.white,
      border:       p.featured ? `2px solid ${S.purpleMid}` : `1px solid ${S.border}`,
      borderRadius: 16,
      padding:      "20px 22px",
      display:      "flex",
      alignItems:   "center",
      gap:          18,
      position:     "relative",
      boxShadow:    p.featured ? "0 4px 20px rgba(124,58,237,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition:   "box-shadow 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.13)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = p.featured ? "0 4px 20px rgba(124,58,237,0.10)" : "0 1px 4px rgba(0,0,0,0.04)"}
    >
      {/* AI Match badge */}
      {p.aiMatch && (
        <div style={{
          position:     "absolute",
          top:          -1,
          right:        20,
          background:   S.purpleGrad,
          color:        "#fff",
          fontSize:     11,
          fontWeight:   700,
          padding:      "4px 10px",
          borderRadius: "0 0 8px 8px",
          letterSpacing: "0.04em",
        }}>
          {p.aiMatch}% AI MATCH
        </div>
      )}

      {/* Logo */}
      <div style={{
        width:          48,
        height:         48,
        borderRadius:   12,
        background:     p.color,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
        color:          "#fff",
        fontSize:       20,
        fontWeight:     800,
      }}>
        {p.initial}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: S.text, marginBottom: 4 }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          {p.verified && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#16a34a", fontWeight: 500 }}>
              <CheckIcon color="#16a34a" /> Verified Provider
            </span>
          )}
          <span style={{ color: S.textMuted, fontSize: 11 }}>•</span>
          <span style={{ fontSize: 11, color: S.textSub }}>{p.tag}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {p.features.map((f) => (
            <span key={f} style={{
              display:      "flex",
              alignItems:   "center",
              gap:          4,
              fontSize:     11,
              color:        S.textSub,
              background:   S.bg,
              padding:      "3px 8px",
              borderRadius: 20,
              border:       `1px solid ${S.border}`,
            }}>
              <CheckIcon color={S.purple} />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Price + CTA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
        <div>
          <span style={{ fontSize: 26, fontWeight: 800, color: S.text }}>${p.price}</span>
          <span style={{ fontSize: 13, color: S.textMuted, fontWeight: 400 }}>/mo</span>
        </div>
        <button style={{
          padding:      "9px 20px",
          borderRadius: 10,
          fontSize:     13,
          fontWeight:   600,
          cursor:       "pointer",
          border:       "none",
          background:   p.ctaPrimary ? S.purpleGrad : S.bg,
          color:        p.ctaPrimary ? "#fff" : S.text,
          boxShadow:    p.ctaPrimary ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
          border:       p.ctaPrimary ? "none" : `1px solid ${S.border}`,
          transition:   "opacity 0.2s",
          fontFamily:   S.font,
          whiteSpace:   "nowrap",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {p.cta}
        </button>
      </div>
    </div>
  );
}

export default PolicyCard;
