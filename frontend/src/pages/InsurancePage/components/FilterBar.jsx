import React from "react";
import { FilterIcon } from "./Icons";
import { Search, ChevronDown, RefreshCw } from "lucide-react";

function FilterBar({ filters, updateFilter, setFilters }) {
  const inputClassName =
    "px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-500 transition-all hover:bg-white";

  return (
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

      <button
        onClick={setFilters}
        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-2"
      >
        Clear All
      </button>
    </div>
  );
}

export default FilterBar;
