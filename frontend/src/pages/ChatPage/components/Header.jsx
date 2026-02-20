import React from 'react';
import { motion } from "framer-motion";
import { Bot, MoreVertical } from "lucide-react";
import { T } from "../styles/theme";

const Header = React.memo(() => {
  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      gap:          12,
      padding:      "14px 20px 13px",
      borderBottom: `1px solid ${T.border}`,
      background:   T.cardBg,
      flexShrink:   0,
    }}>
      <div style={{ position: "relative" }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width:          40,
            height:         40,
            borderRadius:   T.radius.sm + 4,
            background:     T.purpleGrad,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            boxShadow:      "0 2px 10px rgba(124,58,237,0.30)",
          }}
        >
          <Bot size={18} color="#fff" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position:     "absolute",
            bottom:       -1,
            right:        -1,
            width:        11,
            height:       11,
            borderRadius: "50%",
            background:   T.green,
            border:       "2px solid #fff",
          }}
        />
      </div>

      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0, lineHeight: 1.3 }}>
          Lumina AI
        </p>
        <p style={{ fontSize: 11, color: T.textSecondary, margin: 0 }}>
          Insurance Specialist
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        style={{ marginLeft: "auto", cursor: "pointer", padding: 4 }}
      >
        <MoreVertical size={18} style={{ color: T.textSecondary }} />
      </motion.div>
    </div>
  );
});

export default Header;
