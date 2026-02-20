import React from 'react';
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, FileText, ChevronRight, SlidersHorizontal } from "lucide-react";
import { T } from "../styles/theme";

export const GuidanceToast = React.memo(({ appliedFilters }) => {
  const entries = Object.entries(appliedFilters || {});
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          10,
        padding:      "10px 14px",
        background:   T.greenLight,
        border:       `1px solid ${T.greenBorder}`,
        borderRadius: `${T.radius.xs}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px`,
        maxWidth:     "100%",
      }}
    >
      <SlidersHorizontal size={14} style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.greenText, margin: "0 0 4px 0" }}>
          Filters updated!
        </p>
        {entries.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {entries.map(([k, v]) => (
              <span key={k} style={{
                fontSize:     10,
                padding:      "2px 8px",
                background:   T.greenChip,
                border:       `1px solid ${T.greenBorder}`,
                borderRadius: T.radius.full,
                color:        T.greenDark,
                fontWeight:   500,
              }}>
                {k}: {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export const AnalyticsCard = React.memo(({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width:        "100%",
        background:   T.cardBg,
        border:       `1px solid ${T.border}`,
        borderRadius: T.radius.lg,
        overflow:     "hidden",
        boxShadow:    T.shadow.card,
      }}
    >
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <TrendingUp size={12} style={{ color: T.purple }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.purple }}>
            Analytics Insight
          </span>
        </div>
        {[data.insight, data.insight2].filter(Boolean).map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i === 0 ? 8 : 0 }}
          >
            <CheckCircle2 size={14} style={{ color: T.purple, flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: T.textPrimary, lineHeight: 1.55 }}>{ins}</span>
          </motion.div>
        ))}
      </div>

      {data.comparison?.length > 0 && (
        <div style={{ padding: "12px 16px 14px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 10px 0" }}>
            Quick Comparison
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {data.comparison.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.1 }}
                style={{
                  padding:      "10px 12px",
                  background:   plan.highlight ? T.purpleLight : "#fafafa",
                  border:       plan.highlight ? `1.5px solid ${T.purpleMid}` : "1px solid #e5e7eb",
                  borderRadius: T.radius.md,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{plan.name}</span>
                  {plan.tag && (
                    <span style={{
                      fontSize: 8, padding: "2px 6px", borderRadius: T.radius.full,
                      fontWeight: 700, letterSpacing: "0.08em",
                      background: plan.highlight ? T.purple : "#e5e7eb",
                      color:      plan.highlight ? "#fff" : T.textSecondary,
                    }}>
                      {plan.tag}
                    </span>
                  )}
                </div>
                {plan.price && (
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.textPrimary, marginBottom: 4, lineHeight: 1 }}>
                    {plan.price}
                  </div>
                )}
                {plan.claimTime && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.purple }} />
                    <span style={{ fontSize: 10, color: T.textSecondary }}>{plan.claimTime}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
});

export const PolicyCard = React.memo(({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width:        "100%",
        background:   T.cardBg,
        border:       `1px solid ${T.border}`,
        borderRadius: T.radius.lg,
        overflow:     "hidden",
        boxShadow:    T.shadow.card,
      }}
    >
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FileText size={12} style={{ color: T.purple }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textSecondary }}>
              Policy Comparison
            </span>
          </div>
          <ChevronRight size={14} style={{ color: T.purple }} />
        </div>
        {data.comparison?.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "10px 0",
              borderBottom:   i < data.comparison.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            <span style={{ fontSize: 13, color: T.textPrimary }}>{p.name}</span>
            <span style={{
              fontSize:     13,
              fontWeight:   600,
              color:        p.status === "yes" ? "#16a34a" : T.textSecondary,
              background:   p.status === "yes" ? "rgba(22,163,74,0.08)" : "transparent",
              padding:      "2px 8px",
              borderRadius: T.radius.full,
            }}>
              {p.coverage}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
