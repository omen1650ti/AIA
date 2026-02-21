import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageRow from "./components/MessageRow";
import TypingIndicator from "./components/TypingIndicator";
import InputBar from "./components/InputBar";
import { T } from "./styles/theme";
import { MOCK_RESPONSES } from "./util/constants";

function ChatPage({ filters, setFilters }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started,  setStarted]  = useState(false);

  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);
  const mockIndexRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (textOverride) => {
      const text = typeof textOverride === "string" ? textOverride.trim() : input.trim();

      if (!text || isTyping) return;

      setStarted(true);
      setInput("");
      
      // Add user message with a temporary unique ID
      const userMsgId = Date.now();
      setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: text }]);
      setIsTyping(true);

      const searchParams = new URLSearchParams(window.location.search);
      const isMyPolicyChat = window.location.pathname === "/policies" && searchParams.get("tab") === "mine";

      try {
        const res  = await axios.post("/api/chat", { 
          message: text,
          isMyPolicyChat: isMyPolicyChat
        });
        const data = res.data;

        if (data.type === "guidance") {
          const newFilters = { ...filters, ...data.filters };
          setFilters(newFilters);

          setMessages((prev) => [
            ...prev,
            {
              id:             Date.now() + 1,
              role:           "assistant",
              type:           "guidance",
              content:        "",
              appliedFilters: data.filters,
            },
          ]);
        } else {
          await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
          const mock = MOCK_RESPONSES[mockIndexRef.current % MOCK_RESPONSES.length];
          mockIndexRef.current += 1;
          setMessages((prev) => [...prev, { id: Date.now() + 2, role: "assistant", ...mock }]);
        }
      } catch (_err) {
        await new Promise((r) => setTimeout(r, 500));
        const mock = MOCK_RESPONSES[mockIndexRef.current % MOCK_RESPONSES.length];
        mockIndexRef.current += 1;
        setMessages((prev) => [...prev, { id: Date.now() + 3, role: "assistant", ...mock }]);
      } finally {
        setIsTyping(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [input, isTyping, filters, setFilters]
  );

  return (
    <>
      <Header />

      <div style={{
        flex:            1,
        overflowY:       "auto",
        padding:         "20px 16px 8px",
        display:         "flex",
        flexDirection:   "column",
        gap:             16,
        scrollbarWidth:  "none",
        msOverflowStyle: "none",
        background:      T.messageBg,
      }}>
        <AnimatePresence>
          {!started && <WelcomeScreen key="welcome" onSend={handleSend} />}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageRow key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>

        <div ref={bottomRef} style={{ height: 4 }} />
      </div>

      <InputBar
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isTyping={isTyping}
        inputRef={inputRef}
      />
    </>
  );
}

export default ChatPage;