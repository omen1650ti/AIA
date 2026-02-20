import React from 'react';
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { T } from "../styles/theme";

export const UserBubble = React.memo(({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding:      "10px 14px",
        borderRadius: `${T.radius.lg}px ${T.radius.lg}px ${T.radius.xs}px ${T.radius.lg}px`,
        background:   T.purpleGrad,
        color:        "#fff",
        fontSize:     13,
        lineHeight:   1.6,
        wordBreak:    "break-word",
        boxShadow:    T.shadow.bubble,
      }}
    >
      {text}
    </motion.div>
  );
});

export const AssistantBubble = React.memo(({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding:      "10px 14px",
        borderRadius: `${T.radius.xs}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px`,
        background:   T.purpleLight,
        border:       `1px solid ${T.border}`,
        color:        T.textPrimary,
        fontSize:     13,
        lineHeight:   1.6,
        wordBreak:    "break-word",
      }}
    >
      {text}
    </motion.div>
  );
});

export const ErrorBubble = React.memo(({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          8,
        padding:      "10px 14px",
        background:   T.redLight,
        border:       `1px solid ${T.redBorder}`,
        borderRadius: `${T.radius.xs}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px`,
        fontSize:     13,
        color:        T.red,
        lineHeight:   1.5,
      }}
    >
      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
      {message || "Something went wrong. Please check your connection and try again."}
    </motion.div>
  );
});
