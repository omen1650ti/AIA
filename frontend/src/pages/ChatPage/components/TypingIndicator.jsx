import React from 'react';
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { T } from "../styles/theme";

const TypingIndicator = React.memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
      style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
    >
      <motion.div
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background:     T.purpleGrad,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexShrink:     0,
          boxShadow:      "0 2px 8px rgba(124,58,237,0.30)",
        }}
      >
        <Bot size={14} color="#fff" />
      </motion.div>
      <div style={{
        display:      "flex",
        alignItems:   "center",
        gap:          5,
        padding:      "10px 16px",
        background:   T.purpleLight,
        border:       `1px solid ${T.border}`,
        borderRadius: `${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.xs}px`,
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 7, height: 7, borderRadius: "50%", background: T.purple }}
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: 11, color: T.textSecondary, alignSelf: "center" }}
      >
        Lumina is analyzing…
      </motion.span>
    </motion.div>
  );
});

export default TypingIndicator;
