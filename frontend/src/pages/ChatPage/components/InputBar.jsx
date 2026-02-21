import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { T } from "../styles/theme";

const InputBar = React.memo(
  ({
    input,
    setInput,
    onSend,
    isTyping,
    inputRef,
    isGuidanceEnabled,
    setIsGuidanceEnabled,
  }) => {
    const canSend = input.trim().length > 0 && !isTyping;
    const showToggle = input.trim().length > 0;

    return (
      <div
        style={{
          flexShrink: 0,
          padding: "12px 16px 20px",
          borderTop: `1px solid ${T.border}`,
          background: T.cardBg,
          position: "relative",
        }}
      >
        <AnimatePresence>
          {showToggle && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <button
                onClick={() => setIsGuidanceEnabled(!isGuidanceEnabled)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: T.radius.full,
                  background: isGuidanceEnabled ? T.purpleLight : "white",
                  border: `1.5px solid ${isGuidanceEnabled ? T.purple : T.border}`,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 20,
                    background: isGuidanceEnabled ? T.purple : T.border,
                    position: "relative",
                    transition: "background 0.25s",
                  }}
                >
                  <motion.div
                    animate={{ x: isGuidanceEnabled ? 16 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isGuidanceEnabled ? T.purple : T.textSecondary,
                  }}
                >
                  Help me find policies
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileFocusWithin={{
            boxShadow: `0 0 0 3px ${T.purpleLight}, 0 2px 8px rgba(124,58,237,0.12)`,
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 10px 10px 14px",
            background: T.bg,
            border: `1.5px solid ${T.border}`,
            borderRadius: T.radius.full,
            transition: "box-shadow 0.2s",
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
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: T.textPrimary,
              caretColor: T.purple,
            }}
          />

          <motion.button
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
            onClick={() => canSend && onSend()}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: canSend ? T.purpleGrad : T.border,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canSend ? "pointer" : "default",
              flexShrink: 0,
              boxShadow: canSend ? T.shadow.send : "none",
              transition: "background 0.25s, box-shadow 0.25s",
            }}
          >
            <Send size={16} color={canSend ? "#fff" : T.purpleMid} />
          </motion.button>
        </motion.div>

        <p
          style={{
            textAlign: "center",
            fontSize: 10,
            color: T.textMuted,
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          AI can make mistakes. Always review policy terms before signing.
        </p>
      </div>
    );
  },
);

export default InputBar;
