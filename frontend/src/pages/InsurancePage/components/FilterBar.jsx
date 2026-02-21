import React from "react";
import { FilterIcon } from "./Icons";
import { Search, ChevronDown, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FilterBar({ filters, updateFilter, setFilters }) {
  const inputClassName =
    "px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-500 transition-all hover:bg-white";

  // Define which filters to show as chips and how to format their labels
  const filterConfig = {
    plan_name: { label: "Search", type: "text" },
    room_rent_type: { label: "Room", type: "text" },
    min_sum_insured: { label: "Min Sum Insured", type: "currency" },
    max_sum_insured: { label: "Max sum insured", type: "currency" },
    min_waiting_period: {
      label: "Waiting Period",
      type: "number",
      suffix: " yrs",
    },
    max_waiting_period: {
      label: "Max Waiting",
      type: "number",
      suffix: " yrs",
    },
    min_ncb: { label: "Min NCB", type: "number", suffix: "%" },
    min_claim_settlement: { label: "Min CSR", type: "number", suffix: "%" },
    min_cashless_hospitals: { label: "Min Hospitals", type: "number" },
    free_checkup: { label: "Free Checkup", type: "boolean" },
    maternity_cover: { label: "Maternity", type: "boolean" },
    ayush: { label: "AYUSH", type: "boolean" },
    air_evacuation: { label: "Air Evacuation", type: "boolean" },
    home_hospitalization: { label: "Home Hospitalization", type: "boolean" },
    e_consultation: { label: "E-Consultation", type: "boolean" },
    baby_addition: { label: "Baby Addition", type: "boolean" },
    newborn_baby_cover: { label: "Newborn Cover", type: "boolean" },
    daily_cash_allowance: { label: "Daily Cash", type: "boolean" },
    animal_bite_vaccination: { label: "Vaccination", type: "boolean" },
    pre_existing_illness: { label: "Pre-existing Cover", type: "boolean" },
    personal_accident_care: { label: "Accident Care", type: "boolean" },
    premium_care: { label: "Premium Care", type: "boolean" },
    wait_period_modification: { label: "Wait Modification", type: "boolean" },
  };

  const activeChips = Object.entries(filters)
    .filter(([key, value]) => {
      // Don't show internal params or empty/null values
      if (["skip", "limit", "sort_by", "sort_order"].includes(key))
        return false;
      if (value === null || value === undefined || value === "") return false;
      // For boolean filters, only show if they are true (optional, but cleaner)
      if (typeof value === "boolean" && !value) return false;
      return !!filterConfig[key];
    })
    .map(([key, value]) => ({
      key,
      label: filterConfig[key].label,
      valueText:
        typeof value === "boolean"
          ? ""
          : `${value}${filterConfig[key].suffix || ""}`,
    }));

  const removeFilter = (key) => {
    updateFilter({ target: { name: key, value: "" } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            name="plan_name"
            placeholder="Search plans..."
            value={filters.plan_name || ""}
            onChange={updateFilter}
            className={`${inputClassName} pl-8 w-full`}
          />
        </div>

        {/* Room Type Select */}
        <div className="relative">
          <select
            name="room_rent_type"
            value={filters.room_rent_type || ""}
            onChange={updateFilter}
            className={`${inputClassName} appearance-none pr-8 min-w-[130px]`}
          >
            <option value="">Room Type</option>
            <option value="Single Private Room">Private Room</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Any Room">Any Room</option>
          </select>
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={14}
          />
        </div>

        {/* Waiting Period Input */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Waiting:
          </span>
          <input
            type="number"
            name="min_waiting_period"
            placeholder="Max Yrs"
            value={filters.min_waiting_period || ""}
            onChange={updateFilter}
            className={`${inputClassName} w-[110px]`}
          />
        </div>

        {/* Sort By Select */}
        <div className="relative">
          <select
            name="sort_by"
            value={filters.sort_by || ""}
            onChange={updateFilter}
            className={`${inputClassName} appearance-none pr-8 min-w-[140px]`}
          >
            <option value="">Sort By</option>
            <option value="base_price">Price: Low to High</option>
            <option value="claim_settlement_ratio_percent">
              Claim Ratio: High
            </option>
            <option value="cashless_hospitals">Top Networks</option>
          </select>
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={14}
          />
        </div>

        {activeChips.length > 0 && (
          <button
            onClick={setFilters}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-2 flex items-center gap-1"
          >
            <RefreshCw size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Applied Filters Chips */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {activeChips.map((chip) => (
              <motion.div
                key={chip.key}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 transition-colors group"
              >
                <span className="opacity-70">{chip.label}:</span>
                <span>{chip.valueText}</span>
                <button
                  onClick={() => removeFilter(chip.key)}
                  className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
                >
                  <X
                    size={10}
                    className="text-indigo-400 group-hover:text-indigo-600"
                  />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterBar;
