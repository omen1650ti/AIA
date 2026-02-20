import React from 'react';
import { FilterIcon } from "./Icons";

function FilterBar({ filters, updateFilter, setFilters }) {
  const inputClassName = "px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white outline-none font-sans cursor-pointer focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all";

  return (
    <div className="flex items-center gap-2 px-8 py-3 bg-white border-b border-slate-200 flex-wrap shrink-0">
      <div className="flex items-center gap-1.5 text-slate-500 text-sm mr-1">
        <FilterIcon />
        <span className="font-medium">Filters</span>
      </div>

      <select
        name="type"
        value={filters.type}
        onChange={updateFilter}
        className={inputClassName}
      >
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
        className={`${inputClassName} w-[120px]`}
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={filters.age}
        onChange={updateFilter}
        className={`${inputClassName} w-[80px]`}
      />

      <input
        type="number"
        name="minCoverage"
        placeholder="Min Coverage"
        value={filters.minCoverage}
        onChange={updateFilter}
        className={`${inputClassName} w-[130px]`}
      />

      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={updateFilter}
        className={inputClassName}
      >
        <option value="">Sort By</option>
        <option value="premium_asc">Premium: Low → High</option>
        <option value="premium_desc">Premium: High → Low</option>
        <option value="coverage_desc">Coverage: High → Low</option>
      </select>

      <button
        onClick={() => setFilters({ type: "", maxPremium: "", age: "", minCoverage: "", search: "", sortBy: "" })}
        className="px-3.5 py-2 bg-violet-50 border border-violet-200 rounded-lg text-sm font-medium text-violet-600 cursor-pointer hover:bg-violet-100 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;
