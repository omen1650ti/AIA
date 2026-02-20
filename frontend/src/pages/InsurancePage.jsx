import React from "react";

function InsurancePage({ policies, filters, updateFilter, setFilters }) {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-500">Insurance Broker</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          name="type" 
          value={filters.type} 
          onChange={updateFilter}
          className="p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
          className="p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-32"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={filters.age}
          onChange={updateFilter}
          className="p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-20"
        />

        <input
          type="number"
          name="minCoverage"
          placeholder="Min Coverage"
          value={filters.minCoverage}
          onChange={updateFilter}
          className="p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-32"
        />

        <input
          type="text"
          name="search"
          placeholder="Search name..."
          value={filters.search}
          onChange={updateFilter}
          className="p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1 min-w-[200px]"
        />

        <select 
          name="sortBy" 
          value={filters.sortBy} 
          onChange={updateFilter}
          className="p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
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
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 transition-colors rounded-md text-sm font-medium"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {policies.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-600 mb-2">{p.name}</h3>
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                <strong className="text-slate-900">Type:</strong> {p.type}
              </p>
              <p>
                <strong className="text-slate-900">Premium:</strong> ${p.premium}/mo
              </p>
              <p>
                <strong className="text-slate-900">Age:</strong> {p.minAge} - {p.maxAge}
              </p>
              <p>
                <strong className="text-slate-900">Coverage:</strong> ${p.coverage.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {policies.length === 0 && (
          <p className="col-span-full text-center text-slate-500 py-10">No policies found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default InsurancePage;
