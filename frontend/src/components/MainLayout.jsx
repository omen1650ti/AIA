import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import ChatPage from "../pages/ChatPage/ChatPage";
import NavBar from "./NavBar";
import PageHeader from "../pages/InsurancePage/components/PageHeader";

const MainLayout = () => {
  const [policies, setPolicies] = useState([]);
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

  const updateFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* LEFT PANEL (dynamic page) */}
      <div className="flex-[3] border-r border-slate-200 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet context={{ policies, filters, updateFilter, setFilters }} />
        </div>
      </div>

      {/* RIGHT PANEL (always chat) */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <ChatPage filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default MainLayout;
