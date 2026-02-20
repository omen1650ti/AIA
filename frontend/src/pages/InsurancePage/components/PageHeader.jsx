import React from "react";
import { S } from "../styles/theme";
import { FilterIcon } from "./Icons";

const PageHeader = () => {
  const btnActionStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "white",
    border: `1px solid ${S.border}`,
    borderRadius: 30,
    fontSize: 14,
    fontWeight: 600,
    color: S.text,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 32,
        padding: "0 32px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: S.text,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Top Recommended Policies
        </h1>
        <p style={{ fontSize: 15, color: S.textSub, marginTop: 4 }}>
          AI-analyzed matches for your family profile and health history.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={btnActionStyle}>
          <FilterIcon /> Filter
        </button>
        <button style={btnActionStyle}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 5L6 9H2V15H6L11 19V5Z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          Sort: AI Rank
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
