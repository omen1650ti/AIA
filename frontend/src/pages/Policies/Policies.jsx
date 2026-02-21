import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../InsurancePage/components/FilterBar";
import PolicyCard from "./components/PolicyCard";
import { Loader2, SearchX } from "lucide-react";
import { useGetPolicies } from "../../hooks/usePolicies";

function Policies() {
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 100,
    plan_name: null,
    room_rent_type: null,
    min_waiting_period: null,
    max_waiting_period: null,
    sort_by: null,
    sort_order: "asc",
  });

  const { data: policiesData, isLoading, error } = useGetPolicies(filters);
  const policies = policiesData || [];
  const navigate = useNavigate();

  const updateFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const resetFilters = () => {
    setFilters({
      skip: 0,
      limit: 100,
      plan_name: null,
      room_rent_type: null,
      min_waiting_period: null,
      max_waiting_period: null,
      sort_by: null,
      sort_order: "asc",
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-8 min-h-screen bg-slate-50/50 w-full">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          setFilters={resetFilters}
        />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-6xl">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 mt-24">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">
              Analyzing available insurance plans...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 mt-24 text-center">
            <div className="bg-red-50 p-4 rounded-2xl">
              <p className="text-red-600 font-bold">Error loading policies</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : policies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 w-full justify-items-center">
            {policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onClick={() => navigate(`/policy-details/${policy.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-24 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-2">
              <SearchX size={48} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No matching policies found
            </h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any insurance plans matching your current
              filters. Try adjusting your preferences or resetting the filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Policies;
