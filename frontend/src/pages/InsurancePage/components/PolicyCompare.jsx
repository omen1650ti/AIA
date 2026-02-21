import React, { useState, useRef, useEffect } from "react";
import { useComparePolicies } from "../../../hooks/useComparePolicies";
import BouncingLoader from "../../../components/BouncingLoader";

const PURPLE       = "#7c3aed";
const PURPLE_LIGHT = "#ede9fe";
const PURPLE_MID   = "#c4b5fd";
const PURPLE_GRAD  = "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)";
const BORDER       = "#e9e3f5";
const BG           = "#f8f7ff";
const TEXT         = "#111827";
const TEXT_SUB     = "#6b7280";
const TEXT_MUTED   = "#9ca3af";

function PolicyDropdown({ label, value, onChange, exclude, policies }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = policies.find((p) => p.id === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
      <div ref={ref} style={{ position: "relative" }}>
        {/* Trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "10px 14px",
            background: "#fff",
            border: `1.5px solid ${open ? PURPLE : BORDER}`,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: selected ? 600 : 400,
            color: selected ? TEXT : TEXT_MUTED,
            cursor: "pointer",
            boxShadow: open ? `0 0 0 3px ${PURPLE_LIGHT}` : "none",
            transition: "all 0.15s",
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selected ? (selected.jsonb_data?.plan_name || selected.name || selected.details || "Unnamed Policy") : "Select a policy…"}
          </span>
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke={PURPLE} strokeWidth="2.5"
            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Options */}
        {open && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: `1.5px solid ${BORDER}`,
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(109,40,217,0.13)",
            zIndex: 200,
            overflow: "hidden",
            maxHeight: "300px",
            overflowY: "auto",
          }}>
            {/* Clear */}
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              style={{
                width: "100%", padding: "9px 14px", textAlign: "left",
                background: "none", border: "none", borderBottom: `1px solid ${BORDER}`,
                fontSize: 12, color: TEXT_MUTED, cursor: "pointer", 
              }}
            >
              — Clear selection
            </button>

            {/* Policy rows */}
            {policies.filter((p) => p.id !== exclude).map((p) => (
              <button
                key={p.id}
                onClick={() => { onChange(p.id); setOpen(false); }}
                onMouseEnter={(e) => { if (value !== p.id) e.currentTarget.style.background = BG; }}
                onMouseLeave={(e) => { if (value !== p.id) e.currentTarget.style.background = "#fff"; }}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  textAlign: "left",
                  background: value === p.id ? PURPLE_LIGHT : "#fff",
                  border: "none",
                  borderBottom: `1px solid ${BORDER}`,
                  fontSize: 13,
                  fontWeight: value === p.id ? 600 : 400,
                  color: value === p.id ? PURPLE : TEXT,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  transition: "background 0.1s",
                }}
              >
                <div>
                  <div style={{ marginBottom: 1 }}>{p.jsonb_data?.plan_name || p.name || p.details || "Unnamed Policy"}</div>
                </div>
                {value === p.id && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Analysis Result Panel ────────────────────────────────────────────────────
function AnalysisPanel({ label, policy, analysis, accent }) {
  if (!policy) return null;

  // Simple Markdown Parser for the specific structure returned by the backend
  const renderContent = (text) => {
    if (!text) return <p style={{ color: TEXT_MUTED }}>No analysis available.</p>;

    // Split by sections or tables
    const lines = text.split("\n");
    
    return lines.map((line, i) => {
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Headers
      if (line.startsWith('## ')) {
        return <h3 key={i} style={{ fontSize: 16, fontWeight: 800, color: accent, margin: "20px 0 10px 0", borderBottom: `1px solid ${BORDER}`, paddingBottom: 4 }}>{line.replace('## ', '')}</h3>;
      }

      // Check for table rows (very simple)
      if (line.includes('|')) {
        if (line.includes('---')) return null; // Skip separators
        const cells = line.split('|').filter(c => c.trim() !== "");
        return (
          <div key={i} style={{ display: "flex", borderBottom: `1px solid ${BG}`, padding: "6px 0" }}>
            {cells.map((cell, idx) => (
              <span key={idx} style={{ flex: 1, fontSize: 12, fontWeight: idx === 0 ? 600 : 400 }}>{cell.trim()}</span>
            ))}
          </div>
        );
      }

      // List items
      if (line.trim().startsWith('- ')) {
        return (
          <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0", fontSize: 13, color: TEXT_SUB }}>
            <span style={{ color: accent, fontWeight: 800 }}>•</span>
            <span>{renderedLine}</span>
          </div>
        );
      }

      // Empty lines
      if (!line.trim()) return <div key={i} style={{ height: 8 }} />;

      return (
        <p key={i} style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_SUB, margin: "4px 0" }}>
          {renderedLine}
        </p>
      );
    });
  };
  
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: "#fff",
      border: `1.5px solid ${BORDER}`,
      borderRadius: 14,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${BORDER}`,
        background: "linear-gradient(135deg, #faf8ff 0%, #f5f3ff 100%)",
      }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 3px 0" }}>
          {label}
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: accent, margin: "0 0 2px 0" }}>
          {policy.jsonb_data?.plan_name || policy.name || policy.details || "Unnamed Policy"}
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", overflowY: "auto", maxHeight: 500 }}>
        {renderContent(analysis)}
      </div>
    </div>
  );
}

// ── Empty Panel ──────────────────────────────────────────────────────────────
function EmptyPanel({ label }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: BG,
      border: `1.5px dashed ${BORDER}`,
      borderRadius: 14,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 20px", gap: 8,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PURPLE_MID} strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <p style={{ fontSize: 12, color: TEXT_MUTED, margin: 0, textAlign: "center", fontStyle: "italic" }}>
        {label}
      </p>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function PolicyCompare({ policies = [] }) {
  const [p1Id, p1SetId] = useState(null);
  const [p2Id, p2SetId] = useState(null);
  const compareMutation = useComparePolicies();

  const p1 = policies.find((p) => p.id === p1Id) || null;
  const p2 = policies.find((p) => p.id === p2Id) || null;

  const canRun = !!p1Id && !!p2Id;

  const handleRun = () => {
    if (!canRun || compareMutation.isPending) return;
    compareMutation.mutate({
      old_policy_id: p1Id,
      new_policy_id: p2Id
    });
  };

  // Extract results from nested JSON
  const results = React.useMemo(() => {
    if (!compareMutation.isSuccess || !compareMutation.data) return null;
    try {
      const resp = compareMutation.data;
      console.log("Original Comparison Response:", resp);
      
      let innerStr = resp.assistant_response;
      if (!innerStr) return null;

      if (typeof innerStr === 'string') {
        // Aggressively clean the string to make it valid JSON
        // The backend seems to send double braces {{ }} instead of { }
        let cleaned = innerStr.trim();
        
        // Replace double braces with single braces globally if they appear to be defining objects
        // We do this cautiously but effectively for this specific format
        cleaned = cleaned.replace(/{{/g, '{').replace(/}}/g, '}');
        
        try {
          const inner = JSON.parse(cleaned);
          const content = inner.assistant_response || inner;
          
          if (content && (content.old || content.new)) {
            return {
              old: content.old || null,
              new: content.new || null
            };
          }
        } catch (innerErr) {
          console.warn("JSON.parse failed on cleaned string, trying fallback...", innerErr);
          
          // Fallback: Try to manually extract old and new strings using regex if JSON.parse fails
          const oldMatch = cleaned.match(/"old":\s*"([\s\S]*?)"(?=,\s*"new"|})/);
          const newMatch = cleaned.match(/"new":\s*"([\s\S]*?)"(?=,\s*"guidance"|})/);
          
          if (oldMatch || newMatch) {
            return {
              old: oldMatch ? oldMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : null,
              new: newMatch ? newMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : null
            };
          }
        }
      } else if (typeof innerStr === 'object') {
        const content = innerStr.assistant_response || innerStr;
        return {
          old: content?.old || null,
          new: content?.new || null
        };
      }
      return null;
    } catch (e) {
      console.error("Overall parsing failed:", e);
      return null;
    }
  }, [compareMutation.isSuccess, compareMutation.data]);

  return (
    <div style={{ padding: "28px 32px", background: BG, minHeight: "100%" }}>

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: "-0.02em" }}>
            Compare Health Policies
          </h2>
        </div>
        <p style={{ fontSize: 13, color: TEXT_SUB, margin: 0 }}>
          Pick any two policies from the dropdowns below and run an AI-powered side-by-side analysis.
        </p>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(109,40,217,0.07)",
      }}>

        {/* ── Dropdown header row ───────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 48px 1fr",
          alignItems: "end",
          gap: 16,
          padding: "20px 24px",
          borderBottom: `1px solid ${BORDER}`,
          background: "linear-gradient(135deg, #faf8ff 0%, #f5f3ff 100%)",
        }}>
          {/* Policy 1 */}
          <PolicyDropdown
            label="Current Policy"
            value={p1Id}
            onChange={(id) => { p1SetId(id); compareMutation.reset(); }}
            exclude={p2Id}
            policies={policies}
          />

          {/* VS badge */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: PURPLE_GRAD,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 800,
            boxShadow: "0 2px 10px rgba(124,58,237,0.3)",
            justifySelf: "center",
            marginBottom: 2,
          }}>
            VS
          </div>

          {/* Policy 2 */}
          <PolicyDropdown
            label="New Policy"
            value={p2Id}
            onChange={(id) => { p2SetId(id); compareMutation.reset(); }}
            exclude={p1Id}
            policies={policies}
          />
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "20px 24px" }}>

          {/* Loader */}
          {compareMutation.isPending && (
            <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
               <BouncingLoader />
               <p style={{ fontSize: 14, fontWeight: 700, color: PURPLE }}>Analyzing policies...</p>
            </div>
          )}

          {/* Idle placeholder */}
          {!compareMutation.isPending && !compareMutation.isSuccess && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "40px 20px", gap: 12,
              background: "linear-gradient(135deg, #faf8ff 0%, #f3f0ff 100%)",
              borderRadius: 12, border: `1px dashed ${PURPLE_MID}`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: PURPLE_LIGHT,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={PURPLE}>
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>
                Select policies to compare
              </p>
              <p style={{ fontSize: 12, color: TEXT_SUB, margin: 0, textAlign: "center" }}>
                Use the dropdowns above to choose your current and a new health policy, then click Run AI Analysis.
              </p>
            </div>
          )}

          {/* Results — side by side */}
          {!compareMutation.isPending && compareMutation.isSuccess && (
            results ? (
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <AnalysisPanel 
                  label="Current Policy Study"
                  policy={p1} 
                  analysis={results.old} 
                  accent={PURPLE} 
                />
                <AnalysisPanel 
                  label="New Policy Comparison"
                  policy={p2} 
                  analysis={results.new} 
                  accent="#0891b2" 
                />
              </div>
            ) : (
              <div style={{ padding: "24px", color: "#b91c1c", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fee2e2", textAlign: "center" }}>
                <p style={{ fontWeight: 700 }}>Data Parsing Error</p>
                <p style={{ fontSize: 12 }}>The AI response was received but couldn't be displayed. Please check the logs or try again.</p>
              </div>
            )
          )}
          
          {compareMutation.isError && (
             <div style={{ padding: "20px", color: "#b91c1c", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fee2e2", textAlign: "center" }}>
               <p style={{ fontWeight: 700 }}>Comparison Failed</p>
               <p style={{ fontSize: 12 }}>Please try again later.</p>
             </div>
          )}
        </div>

        {/* ── Footer — Run / Re-run button ─────────────────────────────── */}
        {!compareMutation.isPending && canRun && (
          <div style={{
            borderTop: `1px solid ${BORDER}`,
            padding: "14px 24px",
            display: "flex", justifyContent: "center",
            background: "linear-gradient(135deg, #faf8ff 0%, #f5f3ff 100%)",
          }}>
            <button
              onClick={handleRun}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 28px",
                background: PURPLE_GRAD,
                border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.30)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.87")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {compareMutation.isSuccess ? "Re-run AI Analysis" : "Run AI Comparison Analysis"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
