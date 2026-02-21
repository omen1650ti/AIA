import React from "react";
import { motion } from "framer-motion";
import BotAvatar from "./BotAvatar";
import QuickStartBtn from "./QuickStartBtn";
import { T } from "../styles/theme";
import { QUICK_STARTS } from "../util/constants";

const WelcomeScreen = React.memo(({ onSend }) => {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ duration: 0.45 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        paddingTop: 4,
      }}
    >
      {/* Greeting bubble */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <BotAvatar size={32} pulse />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: -8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: "12px 15px",
            background: T.purpleGrad,
            color: "#fff",
            fontSize: 13,
            lineHeight: 1.65,
            maxWidth: "80%",
            borderRadius: `${T.radius.xs}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px`,
            boxShadow: T.shadow.bubble,
          }}
        >
          Hello! I'm your AIA assistant. I can help you find the perfect
          insurance policy, explain complex terms, or analyze your current
          coverage. How can I assist you today?
        </motion.div>
      </div>

      {/* Timestamp */}
      <p
        style={{
          fontSize: 10,
          color: T.textMuted,
          textAlign: "center",
          margin: 0,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Just Now
      </p>

      {/* Quick starts */}
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.textMuted,
            margin: "0 0 8px 0",
          }}
        >
          Quick Starts
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUICK_STARTS.map((qs, i) => (
            <QuickStartBtn
              key={i}
              icon={qs.icon}
              label={qs.label}
              onClick={onSend}
              delay={0.18 + i * 0.08}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export default WelcomeScreen;
