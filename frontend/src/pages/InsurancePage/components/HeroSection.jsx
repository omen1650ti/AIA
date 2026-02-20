import React from 'react';
import { SparkleIcon } from "./Icons";
import { S } from "../styles/theme";
import { CATEGORIES } from "../util/constants";

function HeroSection() {
  return (
    <div style={{
      padding:      "36px 32px 28px",
      background:   "linear-gradient(135deg, #faf8ff 0%, #f3f0ff 100%)",
      borderBottom: `1px solid ${S.border}`,
    }}>
    
      {/* Headline */}
      <h1 style={{ margin: "0 0 4px 0", fontSize: 32, fontWeight: 800, color: S.text, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
        Find the Right Insurance
      </h1>
      <h1 style={{ margin: "0 0 14px 0", fontSize: 32, fontWeight: 800, color: S.purple, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
        Tailored for Your Life
      </h1>
      <p style={{ margin: "0 0 28px 0", fontSize: 14, color: S.textSub, lineHeight: 1.6, maxWidth: 420 }}>
        Compare personalized premium plans in seconds with our 2026 AI matching engine. Real-time data, zero paperwork.
      </p>

      {/* Category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 640 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            style={{
              padding:      "18px 14px",
              background:   S.white,
              border:       `1px solid ${S.border}`,
              borderRadius: 14,
              cursor:       "pointer",
              textAlign:    "left",
              transition:   "box-shadow 0.2s, border-color 0.2s",
              boxShadow:    "0 1px 4px rgba(109,40,217,0.06)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.14)"; e.currentTarget.style.borderColor = S.purpleMid; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(109,40,217,0.06)"; e.currentTarget.style.borderColor = S.border; }}
          >
            <div style={{ marginBottom: 10 }}>{cat.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 2 }}>{cat.label}</div>
            <div style={{ fontSize: 11, color: S.textMuted }}>{cat.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;
