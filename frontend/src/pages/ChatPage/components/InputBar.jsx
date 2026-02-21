import React from 'react';
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { T } from "../styles/theme";

const InputBar = React.memo(({ input, setInput, onSend, isTyping, inputRef }) => {
  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <div style={{
      flexShrink:  0,
      padding:     "12px 16px 20px",
      borderTop:   `1px solid ${T.border}`,
      background:  T.cardBg,
    }}>
      <motion.div
        whileFocusWithin={{
          boxShadow: `0 0 0 3px ${T.purpleLight}, 0 2px 8px rgba(124,58,237,0.12)`,
        }}
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          padding:      "10px 10px 10px 14px",
          background:   T.bg,
          border:       `1.5px solid ${T.border}`,
          borderRadius: T.radius.full,
          transition:   "box-shadow 0.2s",
        }}
      >

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
          placeholder="Ask Lumina anything..."
          style={{
            flex:       1,
            background: "transparent",
            border:     "none",
            outline:    "none",
            fontSize:   13,
            color:      T.textPrimary,
            caretColor: T.purple,
          }}
        />

        <motion.button
          whileHover={canSend ? { scale: 1.08 } : {}}
          whileTap={canSend   ? { scale: 0.88 } : {}}
          onClick={() => canSend && onSend()}
          style={{
            width:          36,
            height:         36,
            borderRadius:   "50%",
            background:     canSend ? T.purpleGrad : T.border,
            border:         "none",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            cursor:         canSend ? "pointer" : "default",
            flexShrink:     0,
            boxShadow:      canSend ? T.shadow.send : "none",
            transition:     "background 0.25s, box-shadow 0.25s",
          }}
        >
          <Send size={14} color={canSend ? "#fff" : T.purpleMid} />
        </motion.button>
      </motion.div>

      <p style={{
        textAlign:    "center",
        fontSize:     10,
        color:        T.textMuted,
        marginTop:    8,
        marginBottom: 0,
      }}>
        AI can make mistakes. Always review policy terms before signing.
      </p>
    </div>
  );
});

export default InputBar;
