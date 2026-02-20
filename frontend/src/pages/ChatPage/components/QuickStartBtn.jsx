import React from 'react';
import { motion } from "framer-motion";
import { T } from "../styles/theme";

const QuickStartBtn = React.memo(({ icon, label, onClick, delay }) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 5, boxShadow: T.shadow.card }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(label)}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          10,
        padding:      "13px 16px",
        background:   T.cardBg,
        border:       `1px solid ${T.border}`,
        borderRadius: T.radius.md,
        cursor:       "pointer",
        fontSize:     13,
        fontWeight:   500,
        color:        T.textPrimary,
        textAlign:    "left",
        width:        "100%",
        fontFamily:   T.font,
        transition:   "box-shadow 0.2s",
      }}
    >
      <span style={{
        color:          T.purple,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          28,
        height:         28,
        background:     T.purpleLight,
        borderRadius:   T.radius.sm,
        flexShrink:     0,
      }}>
        {icon}
      </span>
      {label}
    </motion.button>
  );
});

export default QuickStartBtn;
