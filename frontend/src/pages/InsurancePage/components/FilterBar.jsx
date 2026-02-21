import React from "react";
import { FilterIcon } from "./Icons";
import { Search, ChevronDown, RefreshCw } from "lucide-react";

function FilterBar({ filters, updateFilter, setFilters }) {
  const inputClassName =
    "px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white outline-none font-sans cursor-pointer focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all hover:border-slate-300";

  return (
    <div className="flex items-center gap-4 px-8 py-5 bg-white flex-wrap shrink-0">
      <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl mr-2">
        <FilterIcon />
        <span className="font-bold text-sm tracking-tight">Filters</span>
      </div>

      <div className="relative grow max-w-xs">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          name="plan_name"
          placeholder="Search plan name..."
          value={filters.plan_name || ""}
          onChange={updateFilter}
          className={`${inputClassName} pl-11 w-full`}
        />
      </div>

      <div className="relative">
        <select
          name="room_rent_type"
          value={filters.room_rent_type || ""}
          onChange={updateFilter}
          className={`${inputClassName} appearance-none pr-10`}
        >
          <option value="">Room Type</option>
          <option value="Single Private Room">Single Private Room</option>
          <option value="Shared Room">Shared Room</option>
          <option value="Any Room">Any Room</option>
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={16}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Waiting Period
        </span>
        <input
          type="number"
          name="min_waiting_period"
          placeholder="Max years"
          value={filters.min_waiting_period || ""}
          onChange={updateFilter}
          className={`${inputClassName} w-[110px]`}
        />
      </div>

      <div className="relative">
        <select
          name="sort_by"
          value={filters.sort_by || ""}
          onChange={updateFilter}
          className={`${inputClassName} appearance-none pr-10`}
        >
          <option value="">Sort By</option>
          <option value="base_price">Premium: Low → High</option>
          <option value="claim_settlement_ratio_percent">
            Claim Ratio: High → Low
          </option>
          <option value="cashless_hospitals">Cashless Hospitals</option>
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={16}
        />
      </div>

      <button
        onClick={setFilters}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 hover:text-slate-900 transition-all ml-auto active:scale-95"
      >
        <RefreshCw size={16} />
        Reset
      </button>
    </div>
  );
}

export default FilterBar;
