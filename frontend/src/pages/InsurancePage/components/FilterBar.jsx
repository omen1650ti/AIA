import React from 'react';
import { FilterIcon } from "./Icons";
import { S } from "../styles/theme";

function FilterBar({ filters, updateFilter, setFilters }) {
  const inputStyle = {
    padding:      "8px 12px",
    border:       `1px solid ${S.border}`,
    borderRadius: 8,
    fontSize:     13,
    color:        S.text,
    background:   S.white,
    outline:      "none",
    fontFamily:   S.font,
    cursor:       "pointer",
  };

  return (
    <div style={{
      display:    "flex",
      alignItems: "center",
      gap:        8,
      padding:    "12px 32px",
      background: S.white,
      borderBottom: `1px solid ${S.border}`,
      flexWrap:   "wrap",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: S.textSub, fontSize: 13, marginRight: 4 }}>
        <FilterIcon />
        <span style={{ fontWeight: 500 }}>Filters</span>
      </div>

      <select name="type" value={filters.type} onChange={updateFilter} style={inputStyle}>
        <option value="">All Types</option>
        <option value="Health">Health</option>
        <option value="Life">Life</option>
        <option value="Home">Home</option>
        <option value="Auto">Auto</option>
      </select>

      <input type="number" name="maxPremium" placeholder="Max Premium" value={filters.maxPremium} onChange={updateFilter}
        style={{ ...inputStyle, width: 120 }} />

      <input type="number" name="age" placeholder="Age" value={filters.age} onChange={updateFilter}
        style={{ ...inputStyle, width: 80 }} />

      <input type="number" name="minCoverage" placeholder="Min Coverage" value={filters.minCoverage} onChange={updateFilter}
        style={{ ...inputStyle, width: 130 }} />

      <select name="sortBy" value={filters.sortBy} onChange={updateFilter} style={inputStyle}>
        <option value="">Sort By</option>
        <option value="premium_asc">Premium: Low → High</option>
        <option value="premium_desc">Premium: High → Low</option>
        <option value="coverage_desc">Coverage: High → Low</option>
      </select>

      <button
        onClick={() => setFilters({ type: "", maxPremium: "", age: "", minCoverage: "", search: "", sortBy: "" })}
        style={{
          padding:      "8px 14px",
          background:   S.purpleLight,
          border:       `1px solid ${S.purpleMid}`,
          borderRadius: 8,
          fontSize:     13,
          fontWeight:   500,
          color:        S.purple,
          cursor:       "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;
