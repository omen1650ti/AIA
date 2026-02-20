import React, { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

function ChatPage({ filters, setFilters }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const res = await axios.post("/api/chat", { message: currentInput });
      const data = res.data;

      if (data.type === "guidance") {
        const newFilters = { ...filters, ...data.filters };
        setFilters(newFilters);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="self-start bg-slate-100 text-slate-800 p-3 px-4 rounded-2xl rounded-bl-none max-w-[80%] text-sm shadow-sm">
            Hello! I'm your insurance assistant. Try saying "Find health
            insurance for age 25" or "Show me policies under 100".
          </div>
        )}
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`p-3 px-4 rounded-2xl max-w-[80%] text-sm shadow-sm transition-all ${
              m.role === "user" 
                ? "self-end bg-blue-600 text-white rounded-br-none" 
                : "self-start bg-slate-100 text-slate-800 rounded-bl-none"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form className="p-5 border-t border-slate-200 flex gap-3 bg-slate-50" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your query..."
          className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit"
          className="p-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
