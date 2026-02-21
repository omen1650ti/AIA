import React, { useState, useMemo } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import FilterBar from "../InsurancePage/components/FilterBar";
import PolicyCard from "./components/PolicyCard";
import BouncingLoader from "../../components/BouncingLoader";
import { SearchX, ShieldCheck, Activity, Zap, Clock } from "lucide-react";
import { useGetPolicies } from "../../hooks/usePolicies";

// Hardcoded My Policies data from USER JSON
const MY_POLICIES = [
  {
    id: "29182736455001",
    plan_name: "Optima Secure",
    insurer: "HDFC ERGO General Insurance Company Limited",
    jsonb_data: {
      plan_name: "Optima Secure",
      plan_type: "Individual",
      claim_settlement_ratio_percent: 99,
      cashless_hospitals: 12000,
      existing_waiting_period_yrs: 3,
      features: {
        secure_benefit: true,
        plus_benefit: true,
        restore_benefit: true,
        protect_benefit: true,
      },
    },
    base_price: 10620,
    status: "Active",
    aiMatch: 95,
    highlight: "Instantly doubles base sum insured upon purchase",
    highlightIcon: <Zap size={14} className="text-amber-500" />,
    color: "#0ea5e9", // Sky blue for HDFC
    icon: <ShieldCheck size={24} />,
    isMyPolicyChat: true,
  },
  {
    id: "62963426202600",
    plan_name: "ReAssure 3.0",
    insurer: "Niva Bupa Health Insurance Company Limited",
    jsonb_data: {
      plan_name: "ReAssure 3.0",
      plan_type: "Individual",
      claim_settlement_ratio_percent: 96,
      cashless_hospitals: 10000,
      existing_waiting_period_yrs: 3,
      features: {
        reassure_forever: true,
        booster_plus: true,
        lock_the_clock: true,
        live_healthy: true,
      },
    },
    base_price: 5973,
    status: "Active",
    aiMatch: 89,
    highlight: "Pay premiums as per your entry age till a claim is paid",
    highlightIcon: <Clock size={14} className="text-violet-500" />,
    color: "#8b5cf6", // Violet for Niva Bupa
    icon: <Activity size={24} />,
    isMyPolicyChat: true,
  },
];

function Policies() {
  const {
    filters: globalFilters,
    updateFilter,
    setFilters: setGlobalFilters,
  } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all";
  const navigate = useNavigate();

  const [localFilters, setLocalFilters] = useState({
    skip: 0,
    limit: 100,
    plan_name: null,
    room_rent_type: null,
    min_waiting_period: null,
    max_waiting_period: null,
    sort_by: null,
    sort_order: "asc",
  });

  // Use global filters if available, otherwise fallback to local filters
  const activeFilters = globalFilters || localFilters;

  const {
    data: policiesData,
    isLoading,
    error,
  } = useGetPolicies(activeFilters);
  const apiPolicies = policiesData || [];

  const policies = useMemo(() => {
    if (tab === "mine") return MY_POLICIES;
    return apiPolicies;
  }, [tab, apiPolicies]);

  const setTab = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  const activeUpdateFilter =
    updateFilter ||
    ((e) => {
      const { name, value } = e.target;
      setLocalFilters((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    });

  const resetFilters = () => {
    const emptyFilters = {
      skip: 0,
      limit: 100,
      plan_name: null,
      room_rent_type: null,
      min_waiting_period: null,
      max_waiting_period: null,
      sort_by: null,
      sort_order: "asc",
    };
    if (setGlobalFilters) setGlobalFilters(emptyFilters);
    else setLocalFilters(emptyFilters);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#fafbfc] w-full">
      {/* Header & Tabs */}
      <div className="w-full bg-white border-b border-slate-100 px-8 pt-8 pb-0 ">
        <div className="max-w-6xl mx-auto w-full overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-slate-900 m-0">
              Healthcare Policies
            </h1>
          </div>

          <div className="flex gap-10">
            <button
              onClick={() => setTab("all")}
              className={`pb-4 text-[15px] font-bold transition-all relative border-none bg-none cursor-pointer ${
                tab === "all"
                  ? "text-violet-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              All Policies
              {tab === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setTab("mine")}
              className={`pb-4 text-[15px] font-bold transition-all relative border-none bg-none cursor-pointer ${
                tab === "mine"
                  ? "text-violet-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              My Policies
              {tab === "mine" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600 rounded-t-full" />
              )}
            </button>
          </div>

          {tab === "all" && (
            <div className="pt-2 pb-6">
              <FilterBar
                filters={activeFilters}
                updateFilter={activeUpdateFilter}
                setFilters={resetFilters}
              />
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Listing Content */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pt-8 pb-10">
        <div className="flex flex-col items-center gap-4 w-full max-w-6xl">
        {isLoading && tab === "all" ? (
          <div className="flex flex-col items-center gap-6 mt-24">
            <BouncingLoader size="h-3 w-3" spacing="space-x-2" />
            <p className="text-slate-500 font-medium animate-pulse">
              Analyzing available insurance plans...
            </p>
          </div>
        ) : error && tab === "all" ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 md:px-8">
            {policies.map((policy, idx) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                index={idx}
                isMyPolicyChat={tab === "mine"}
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
              {tab === "mine"
                ? "No personal policies found"
                : "No matching policies found"}
            </h3>
            <p className="text-slate-500 max-w-md">
              {tab === "mine"
                ? "You don't have any active policies linked to your account yet."
                : "We couldn't find any insurance plans matching your current filters. Try adjusting your preferences or resetting the filters."}
            </p>
            {tab === "all" && (
              <button
                onClick={resetFilters}
                className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Policies;
