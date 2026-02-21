import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { T } from "../styles/theme";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const UserBubble = React.memo(({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "10px 14px",
        borderRadius: `${T.radius.lg}px ${T.radius.lg}px ${T.radius.xs}px ${T.radius.lg}px`,
        background: T.purpleGrad,
        color: "#fff",
        fontSize: 13,
        lineHeight: 1.6,
        wordBreak: "break-word",
        boxShadow: T.shadow.bubble,
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
        padding: "10px 14px",
        borderRadius: `${T.radius.xs}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px`,
        background: T.purpleLight,
        border: `1px solid ${T.border}`,
        color: T.textPrimary,
        fontSize: 13,
        lineHeight: 1.6,
        wordBreak: "break-word",
      }}
    >
      <div className="markdown-container">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p
                style={{ margin: "0 0 12px 0", lastChild: { margin: 0 } }}
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                style={{
                  margin: "0 0 12px 0",
                  paddingLeft: "1.5rem",
                  listStyleType: "disc",
                }}
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                style={{
                  margin: "0 0 12px 0",
                  paddingLeft: "1.5rem",
                  listStyleType: "decimal",
                }}
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li style={{ marginBottom: "6px" }} {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong style={{ fontWeight: 700, color: T.purple }} {...props} />
            ),
            a: ({ node, ...props }) => (
              <a
                style={{
                  color: T.purple,
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            h1: ({ node, ...props }) => (
              <h1
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  margin: "16px 0 8px 0",
                  color: T.purple,
                }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  margin: "14px 0 8px 0",
                  color: T.purple,
                }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  margin: "12px 0 6px 0",
                }}
                {...props}
              />
            ),
            code: ({ node, inline, ...props }) => (
              <code
                style={{
                  background: "rgba(124, 58, 237, 0.1)",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                }}
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div style={{ overflowX: "auto", margin: "12px 0" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontSize: "12px",
                  }}
                  {...props}
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                style={{
                  border: `1px solid ${T.border}`,
                  padding: "6px 10px",
                  background: "rgba(124, 58, 237, 0.05)",
                  fontWeight: 600,
                  textAlign: "left",
                }}
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                style={{ border: `1px solid ${T.border}`, padding: "6px 10px" }}
                {...props}
              />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
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
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "10px 14px",
        background: T.redLight,
        border: `1px solid ${T.redBorder}`,
        borderRadius: `${T.radius.xs}px ${T.radius.lg}px ${T.radius.lg}px ${T.radius.lg}px`,
        fontSize: 13,
        color: T.red,
        lineHeight: 1.5,
      }}
    >
      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
      {message ||
        "Something went wrong. Please check your connection and try again."}
    </motion.div>
  );
});
