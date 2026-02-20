import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Send, Shield, User, DollarSign, Filter } from "lucide-react";

function App() {
  const [policies, setPolicies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    maxPremium: "",
    age: "",
    minCoverage: "",
    search: "",
    sortBy: "",
  });

  const fetchPolicies = async (activeFilters) => {
    try {
      const params = {};
      if (activeFilters.type) params.type = activeFilters.type;
      if (activeFilters.maxPremium)
        params.maxPremium = activeFilters.maxPremium;
      if (activeFilters.age) params.age = activeFilters.age;
      if (activeFilters.minCoverage)
        params.minCoverage = activeFilters.minCoverage;
      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.sortBy) params.sortBy = activeFilters.sortBy;

      const res = await axios.get("/api/policies", { params });
      setPolicies(res.data);
    } catch (err) {
      console.error("Error fetching policies", err);
    }
  };

  useEffect(() => {
    fetchPolicies(filters);
  }, [filters]);

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
        // We don't add the message to the chat if it's guidance, per requirements
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

  const updateFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="app-container">
      {/* LEFT PANEL: UI */}
      <div className="ui-panel">
        <h1>Insurance Broker</h1>

        <div className="filters">
          <select name="type" value={filters.type} onChange={updateFilter}>
            <option value="">All Types</option>
            <option value="Health">Health</option>
            <option value="Life">Life</option>
            <option value="Home">Home</option>
            <option value="Auto">Auto</option>
          </select>

          <input
            type="number"
            name="maxPremium"
            placeholder="Max Premium"
            value={filters.maxPremium}
            onChange={updateFilter}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={filters.age}
            onChange={updateFilter}
          />

          <input
            type="number"
            name="minCoverage"
            placeholder="Min Coverage"
            value={filters.minCoverage}
            onChange={updateFilter}
          />

          <input
            type="text"
            name="search"
            placeholder="Search name..."
            value={filters.search}
            onChange={updateFilter}
          />

          <select name="sortBy" value={filters.sortBy} onChange={updateFilter}>
            <option value="">Sort By</option>
            <option value="premium_asc">Premium: Low to High</option>
            <option value="premium_desc">Premium: High to Low</option>
            <option value="coverage_desc">Coverage: High to Low</option>
          </select>

          <button
            onClick={() =>
              setFilters({
                type: "",
                maxPremium: "",
                age: "",
                minCoverage: "",
                search: "",
                sortBy: "",
              })
            }
            style={{ padding: "8px", cursor: "pointer" }}
          >
            Reset
          </button>
        </div>

        <div className="policy-grid">
          {policies.map((p) => (
            <div key={p.id} className="policy-card">
              <h3>{p.name}</h3>
              <p>
                <strong>Type:</strong> {p.type}
              </p>
              <p>
                <strong>Premium:</strong> ${p.premium}/mo
              </p>
              <p>
                <strong>Age:</strong> {p.minAge} - {p.maxAge}
              </p>
              <p>
                <strong>Coverage:</strong> ${p.coverage.toLocaleString()}
              </p>
            </div>
          ))}
          {policies.length === 0 && (
            <p>No policies found matching your criteria.</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT */}
      <div className="chat-panel">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="message assistant">
              Hello! I'm your insurance assistant. Try saying "Find health
              insurance for age 25" or "Show me policies under 100".
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
