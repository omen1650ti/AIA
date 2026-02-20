import React from "react";
import { SearchIcon, BellIcon } from "../pages/InsurancePage/components/Icons";
import { S } from "../pages/InsurancePage/styles/theme";
import { Link } from "react-router-dom";

function NavBar() {
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
            fontSize: 16,
            color: S.text,
            letterSpacing: "-0.02em",
          }}
          to={"/insurance-page"}
        >
          InsureAI
        </Link>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {["Marketplace", "My Policies", "Claims", "Risk Profile"].map(
          (link, i) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 14,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? S.purple : S.textSub,
                textDecoration: "none",
                borderBottom:
                  i === 0 ? `2px solid ${S.purple}` : "2px solid transparent",
                paddingBottom: 2,
                transition: "color 0.2s",
              }}
            >
              {link}
            </a>
          ),
        )}
      </nav>

      {/* Bell + Avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: S.purpleGrad,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
