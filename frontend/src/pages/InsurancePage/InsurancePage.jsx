import React from "react";

// Components
import NavBar from "./components/NavBar";
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import PolicyCard from "./components/PolicyCard";
import GridPolicyCard from "./components/GridPolicyCard";
import { ChevronRightIcon } from "./components/Icons";

// Styles & Utils
import { S } from "./styles/theme";
import { TOP_PICKS } from "./util/constants";

/**
 * InsurancePage.jsx
 * Modularized version.
 */
function InsurancePage({ policies, filters, updateFilter, setFilters }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      height:        "100vh",
      background:    S.bg,
      fontFamily:    S.font,
      overflowY:     "auto",
    }}>
      {/* Nav */}
      <NavBar filters={filters} updateFilter={updateFilter} setFilters={setFilters} />

      {/* Filter bar */}
      <FilterBar filters={filters} updateFilter={updateFilter} setFilters={setFilters} />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Hero */}
        <HeroSection />

        {/* Main content area */}
        <div style={{ padding: "28px 32px 40px", maxWidth: 900 }}>

          {/* Top Picks section */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: S.text, margin: 0 }}>
                  Top Picks for You
                </h2>
                <span style={{
                  fontSize:     11,
                  fontWeight:   600,
                  padding:      "2px 10px",
                  background:   S.purpleLight,
                  color:        S.purple,
                  borderRadius: 20,
                  border:       `1px solid ${S.purpleMid}`,
                }}>
                  {TOP_PICKS.length} MATCHES
                </span>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: S.purple, fontWeight: 600, fontFamily: S.font }}>
                View all results <ChevronRightIcon />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TOP_PICKS.map((p) => (
                <PolicyCard key={p.id} p={p} />
              ))}
            </div>
          </div>

          {/* All Policies section */}
          {policies && policies.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: S.text, margin: 0 }}>
                  All Policies
                </h2>
                <span style={{ fontSize: 13, color: S.textSub }}>
                  {policies.length} result{policies.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
                {policies.map((p) => (
                  <GridPolicyCard key={p.id} p={p} />
                ))}
              </div>

              {policies.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", color: S.textMuted, fontSize: 14 }}>
                  No policies found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Empty state when no policies passed */}
          {(!policies || policies.length === 0) && (
            <div style={{
              textAlign:    "center",
              padding:      "40px 0",
              color:        S.textMuted,
              fontSize:     14,
              background:   S.white,
              borderRadius: 14,
              border:       `1px solid ${S.border}`,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              No policies found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsurancePage;