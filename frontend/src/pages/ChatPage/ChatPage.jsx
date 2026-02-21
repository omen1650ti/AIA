import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { createChatDetail } from "../../services/ChatService";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageRow from "./components/MessageRow";
import TypingIndicator from "./components/TypingIndicator";
import InputBar from "./components/InputBar";
import { T } from "./styles/theme";
import { MOCK_RESPONSES } from "./util/constants";
import ProfileForm from "./components/ProfileForm";

function ChatPage({ filters, setFilters }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [isGuidanceEnabled, setIsGuidanceEnabled] = useState(false);
  const navigate = useNavigate();

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const mockIndexRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (textOverride, profileOverride, isGuidanceOverride) => {
      const text =
        typeof textOverride === "string" ? textOverride.trim() : input.trim();

      if (!text || isTyping) return;

      setStarted(true);
      setInput("");

      // Add user message with a temporary unique ID
      const userMsgId = Date.now();
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text },
      ]);
      setIsTyping(true);

      const searchParams = new URLSearchParams(window.location.search);
      const isMyPolicyChat =
        window.location.pathname === "/policies" &&
        searchParams.get("tab") === "mine";
      const isMyPolicy =
        window.location.pathname === "/policies" &&
        searchParams.get("tab") === "mine";

      try {
        const data = await createChatDetail({
          message: text,
          is_my_policies_chat: isMyPolicy,
          user_profile: profileOverride || userProfile,
          thread_id: threadId,
          is_guidance:
            isGuidanceOverride !== undefined
              ? isGuidanceOverride
              : isGuidanceEnabled,
        });

        if (isGuidanceEnabled) setIsGuidanceEnabled(false);

        if (data.thread_id) {
          setThreadId(data.thread_id);
        }

        if (data.guidance) {
          const filtersToSend =
            typeof data.assistant_response === "object"
              ? data.assistant_response
              : data.filters || {};

          if (filtersToSend && Object.keys(filtersToSend).length > 0) {
            const params = new URLSearchParams();
            Object.entries(filtersToSend).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                params.append(key, value);
              }
            });
            // Also append current tab if needed
            params.append("tab", "all");
            navigate(`/policies?${params.toString()}`);
          }

          const responseContent =
            typeof data.assistant_response === "object"
              ? "Understood. I've analyzed your requirements and updated your policy list with the most relevant options."
              : data.assistant_response ||
                "I've updated the dashboard with policies matching your criteria.";

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              type: "guidance",
              content: responseContent,
              appliedFilters: filtersToSend,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              role: "assistant",
              content:
                typeof data.assistant_response === "object"
                  ? JSON.stringify(data.assistant_response)
                  : data.assistant_response,
            },
          ]);
        }
      } catch (_err) {
        await new Promise((r) => setTimeout(r, 500));
        const mock =
          MOCK_RESPONSES[mockIndexRef.current % MOCK_RESPONSES.length];
        mockIndexRef.current += 1;
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 3, role: "assistant", ...mock },
        ]);
      } finally {
        setIsTyping(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [input, isTyping, filters, setFilters, userProfile, threadId],
  );

  const handleQuickStart = (label) => {
    if (label === "Select Policy") {
      setShowProfileForm(true);
      setStarted(true); // Hide welcome screen but show form
    } else {
      handleSend(label);
    }
  };

  const handleProfileSubmit = (profile) => {
    setUserProfile(profile);
    setShowProfileForm(false);
    // After profile is saved, send an automated message with the profile data
    // and set is_guidance: true to get policy recommendations
    handleSend(
      "I've shared my profile details to help find the best insurance policy.",
      profile,
      true,
    );
  };

  return (
    <>
      <Header />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          background: T.messageBg,
        }}
      >
        <AnimatePresence>
          {!started && (
            <WelcomeScreen key="welcome" onSend={handleQuickStart} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showProfileForm && (
            <ProfileForm
              key="profile-form"
              onSubmit={handleProfileSubmit}
              onCancel={() => {
                setShowProfileForm(false);
                setStarted(false);
              }}
            />
          )}
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
        isGuidanceEnabled={isGuidanceEnabled}
        setIsGuidanceEnabled={setIsGuidanceEnabled}
      />
    </>
  );
}

export default ChatPage;
