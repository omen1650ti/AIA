import React from 'react';
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { T } from "../styles/theme";

const BotAvatar = React.memo(({ size = 32, pulse = false }) => {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width:          size,
        height:         size,
        borderRadius:   "50%",
        background:     T.purpleGrad,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
        boxShadow:      "0 2px 8px rgba(124,58,237,0.28)",
      }}
    >
      <Bot size={Math.round(size * 0.44)} color="#fff" />
    </motion.div>
  );
});

export default BotAvatar;
