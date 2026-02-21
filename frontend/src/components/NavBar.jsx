import React from "react";
import { SearchIcon, BellIcon } from "../pages/InsurancePage/components/Icons";
import { S } from "../pages/InsurancePage/styles/theme";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Policies", path: "/policies" },
    { label: "Review Claim", path: "/claim-reviewer" },
    { label: "Analyze Dispute", path: "/dispute" },
  ];

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "0 32px",
        height: 60,
        background: S.white,
        borderBottom: `1px solid ${S.border}`,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
      >
        <Link
          style={{
            fontWeight: 800,
            fontSize: 20,
            color: S.text,
            letterSpacing: "-0.02em",
            textDecoration: "none",
          }}
          to={"/"}
        >
          InsureAI
        </Link>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: 14,
                color: isActive ? S.purple : S.textSub,
                fontWeight: isActive ? 700 : 500,
                textDecoration: "none",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {link.label}
              {isActive && (
                <div 
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: S.purple,
                    borderRadius: "3px 3px 0 0"
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bell + Avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <BellIcon />
        </button>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e2e8f0",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
