import React from 'react';
import { motion } from "framer-motion";
import BotAvatar from "./BotAvatar";
import { UserBubble, AssistantBubble, ErrorBubble } from "./ChatBubbles";
import { GuidanceToast, AnalyticsCard, PolicyCard } from "./ChatCards";

const MessageRow = React.memo(({ msg }) => {
  const isUser = msg.role === "user";
  const text   = msg.content || "";

  function AssistantContent() {
    switch (msg.type) {
      case "guidance":
        return <GuidanceToast appliedFilters={msg.appliedFilters} />;

      case "analytics":
        return (
          <>
            {text && <AssistantBubble text={text} />}
            <AnalyticsCard data={msg} />
          </>
        );

      case "policy":
        return (
          <>
            {text && <AssistantBubble text={text} />}
            <PolicyCard data={msg} />
          </>
        );

      case "error":
        return <ErrorBubble message={text} />;

      default:
        return text ? <AssistantBubble text={text} /> : null;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{
        display:       "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems:    "flex-end",
        gap:           8,
      }}
    >
      {!isUser && <BotAvatar size={32} />}

      <div style={{
        display:       "flex",
        flexDirection: "column",
        gap:           8,
        maxWidth:      "78%",
        alignItems:    isUser ? "flex-end" : "flex-start",
      }}>
        {isUser
          ? <UserBubble text={text} />
          : <AssistantContent />
        }
      </div>
    </motion.div>
  );
});

export default MessageRow;
