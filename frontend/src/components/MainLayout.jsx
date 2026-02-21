import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import ChatPage from "../pages/ChatPage/ChatPage";
import NavBar from "./NavBar";
import PageHeader from "../pages/InsurancePage/components/PageHeader";

const MainLayout = () => {
  const [filters, setFilters] = useState({
    plan_name: null,
    room_rent_type: null,
    min_sum_insured: null,
    max_sum_insured: null,
    min_waiting_period: null,
    max_waiting_period: null,
    min_ncb: null,
    max_ncb: null,
    min_child_age: null,
    max_child_age: null,
    min_claim_settlement: null,
    min_cashless_hospitals: null,
    sort_by: null,
    sort_order: "asc",
    limit: 100,
    skip: 0,
  });

  const updateFilter = (e) => {
    if (e.target) {
      const { name, value, type, checked } = e.target;
      setFilters((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value === "" ? null : value,
      }));
    } else {
      // Direct object update
      setFilters((prev) => ({ ...prev, ...e }));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* LEFT PANEL (dynamic page) */}
      <div className="flex-[3] border-r border-slate-200 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-auto">
          <Outlet context={{ filters, updateFilter, setFilters }} />
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
