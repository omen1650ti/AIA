import React, { useState, useRef, useEffect } from "react";

const PURPLE       = "#7c3aed";
const PURPLE_LIGHT = "#ede9fe";
const PURPLE_MID   = "#c4b5fd";
const PURPLE_GRAD  = "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)";
const BORDER       = "#e9e3f5";
const BG           = "#f8f7ff";
const TEXT         = "#111827";
const TEXT_SUB     = "#6b7280";
const TEXT_MUTED   = "#9ca3af";
const FONT         = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

const POLICIES = [
  {
    id: 1,
    name: "SafeLife Platinum Plus",
    analysis: `SafeLife Platinum Plus is one of the most comprehensive health plans available. It offers a $0 annual deductible so coverage kicks in immediately. The $249 monthly premium covers $15 co-pay primary care, 100% in-patient hospital, full dental and vision, and global emergency coverage.\n\nIdeal for families with children under 10 — pediatric wellness visits are $0 co-pay up to age 12. Mental health is fully covered with 30 therapy sessions annually. Specialist visits are $35 after referral.\n\nThe plan includes chiropractic (12 visits/yr), acupuncture (8 visits/yr), 98% national hospital network, and a 3-tier prescription formulary: generics $5, preferred brands $30, non-preferred $60.`,
  },
  {
    id: 2,
    name: "Nova Shield Flex",
    analysis: `Nova Shield Flex is a mid-tier plan built for remote workers and frequent domestic travellers. At $185/month it balances affordability with core protection.\n\n$500 deductible, 80/20 co-insurance. Primary care $25 co-pay. Telehealth is completely free — a standout perk for the remote-work demographic. Mental health includes 20 sessions/year virtually or in-person.\n\nBonus: 24/7 nurse line and bundled wellness apps. Network covers 88% of national providers. International coverage is emergency-only so supplemental cover is recommended for extended travel.`,
  },
  {
    id: 3,
    name: "Guardian Platinum",
    analysis: `Guardian Platinum excels in network quality and claims speed at just $124/month — the most affordable solid option in this set.\n\n$750 deductible, 80/20 post-deductible co-insurance. Primary care $30, specialists $50 with no referral needed. Average claims processing is 2 hours — fastest in class.\n\nBase plan excludes dental, vision, and alternative therapy, but the Guardian Wellness Rider ($22/month) bundles all three plus 6 chiropractic visits. Top customer satisfaction ratings for 5 consecutive years.`,
  },
  {
    id: 4,
    name: "Azure Complete Care",
    analysis: `Azure Complete Care is designed for households wanting maximum coverage with minimum friction. $215/month, $250 deductible, 90/10 co-insurance.\n\nPrimary care $10, specialists $25, unlimited telehealth free. Full dental including orthodontics up to $1,500 lifetime, vision, hearing, and 40 mental health sessions annually.\n\nUnique perks: $300 Azure Health Wallet for gym/nutrition/wellness, global non-emergency coverage at 70% in 45 countries, $0 generic prescriptions, and 3 IUI fertility cycles included.`,
  },
  {
    id: 5,
    name: "HealthFirst Basic",
    analysis: `HealthFirst Basic is an entry-level plan for young healthy individuals who want essential coverage at the lowest possible cost. At $89/month it is the most affordable in this set.\n\n$1,500 deductible, 70/30 co-insurance. Primary care $40, specialists $75 with referral. Preventive care — physicals, vaccinations, cancer screenings — covered at 100% with no deductible.\n\nMental health limited to 10 sessions/year. No dental or vision. Generics only for prescriptions. Domestic emergency at 80%; international emergency capped at $5,000. Best for ages 18–30 seeking ACA compliance and catastrophic coverage.`,
  },
];

const LOADER_STEPS = [
  "Reading policy documents…",
  "Extracting coverage terms…",
  "Comparing deductibles & co-pays…",
  "Running AI comparison model…",
  "Generating final report…",
];
function PolicyDropdown({ label, value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = POLICIES.find((p) => p.id === value);

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
            {selected ? `${selected.name} ` : "Select a policy…"}
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
            {POLICIES.filter((p) => p.id !== exclude).map((p) => (
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
                  <div style={{ marginBottom: 1 }}>{p.name}</div>
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

// ── Fake Loader ───────────────────────────────────────────────────────────────
function FakeLoader({ onDone }) {
  const [step, setStep]     = useState(0);
  const [pct,  setPct]      = useState(0);

  useEffect(() => {
    const prog  = setInterval(() => setPct((v) => { if (v >= 100) { clearInterval(prog); return 100; } return v + 2; }), 58);
    const steps = setInterval(() => setStep((v) => v < LOADER_STEPS.length - 1 ? v + 1 : (clearInterval(steps), v)), 540);
    const done  = setTimeout(onDone, 3200);
    return () => { clearInterval(prog); clearInterval(steps); clearTimeout(done); };
  }, [onDone]);

  return (
    <div style={{
      padding: "48px 24px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      background: "linear-gradient(135deg, #faf8ff 0%, #f3f0ff 100%)",
      borderRadius: 14, border: `1px solid ${BORDER}`,
    }}>
     

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: PURPLE, margin: "0 0 4px 0" }}>
          Running AI Comparison Analysis
        </p>
        <p style={{ fontSize: 12, color: TEXT_SUB, margin: 0 }}>
          {LOADER_STEPS[step]}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 300 }}>
        <div style={{ height: 5, borderRadius: 99, background: PURPLE_LIGHT, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${Math.min(pct, 100)}%`,
            background: PURPLE_GRAD, borderRadius: 99,
            transition: "width 0.08s linear",
          }} />
        </div>
        <p style={{ textAlign: "right", fontSize: 11, color: TEXT_MUTED, margin: "3px 0 0 0" }}>
          {Math.min(pct, 100)}%
        </p>
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 5 }}>
        {LOADER_STEPS.map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 99,
            width: i <= step ? 18 : 5,
            background: i <= step ? PURPLE : PURPLE_MID,
            opacity: i <= step ? 1 : 0.35,
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      <style>{`@keyframes pc-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Analysis Result Panel ────────────────────────────────────────────────────
function AnalysisPanel({ policy, accent }) {
  const paras = policy.analysis.split("\n\n").filter(Boolean);
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: "#fff",
      border: `1.5px solid ${BORDER}`,
      borderRadius: 14,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${BORDER}`,
        background: "linear-gradient(135deg, #faf8ff 0%, #f5f3ff 100%)",
      }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 3px 0" }}>
          AI Analysis
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: accent, margin: "0 0 2px 0" }}>
          {policy.name}
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", overflowY: "auto", maxHeight: 360 }}>
        {paras.map((para, i) => (
          <p key={i} style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: i === 0 ? TEXT : TEXT_SUB,
            fontWeight: i === 0 ? 500 : 400,
            margin: i < paras.length - 1 ? "0 0 12px 0" : 0,
          }}>
            {para}
          </p>
        ))}
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
export default function PolicyCompare() {
  const [p1Id,     setP1Id]     = useState(null);
  const [p2Id,     setP2Id]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [analysed, setAnalysed] = useState(false);

  const p1 = POLICIES.find((p) => p.id === p1Id) || null;
  const p2 = POLICIES.find((p) => p.id === p2Id) || null;

  const canRun = !!p1Id || !!p2Id;

  const handleP1Change = (id) => { setP1Id(id); setAnalysed(false); };
  const handleP2Change = (id) => { setP2Id(id); setAnalysed(false); };

  const handleRun = () => {
    if (!canRun || loading) return;
    setAnalysed(false);
    setLoading(true);
  };

  return (
    <div style={{ padding: "28px 32px", background: BG, minHeight: "100%" }}>

      {/* ── Page title ───────────────────────────────────────────────────── */}
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
            label="Policy 1"
            value={p1Id}
            onChange={handleP1Change}
            exclude={p2Id}
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
            label="Policy 2"
            value={p2Id}
            onChange={handleP2Change}
            exclude={p1Id}
          />
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "20px 24px" }}>

          {/* Loader */}
          {loading && (
            <FakeLoader onDone={() => { setLoading(false); setAnalysed(true); }} />
          )}

          {/* Idle placeholder */}
          {!loading && !analysed && (
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
                Use the dropdowns above to choose one or two health policies, then click Run AI Analysis.
              </p>
            </div>
          )}

          {/* Results — side by side */}
          {!loading && analysed && (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {p1
                ? <AnalysisPanel policy={p1} accent={PURPLE} />
                : <EmptyPanel label="No policy selected" />
              }
              {p2
                ? <AnalysisPanel policy={p2} accent="#0891b2" />
                : <EmptyPanel label="No second policy selected" />
              }
            </div>
          )}
        </div>

        {/* ── Footer — Run / Re-run button ─────────────────────────────── */}
        {!loading && canRun && (
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
             
              {analysed ? "Re-run AI Analysis" : "Run AI Comparison Analysis"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}