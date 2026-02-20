import React from 'react';
import { CheckIcon } from "./Icons";

function PolicyCard({ p }) {
  return (
    <div 
      className={`bg-white rounded-2xl p-5 flex items-center gap-4.5 relative transition-shadow duration-200 shadow-sm hover:shadow-[0_8px_28px_rgba(124,58,237,0.13)] ${
        p.featured ? "border-2 border-violet-300 shadow-[0_4px_20px_rgba(124,58,237,0.1)]" : "border border-slate-200"
      }`}
    >
    

      {/* Logo */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white text-xl font-extrabold"
        style={{ background: p.color }}
      >
        {p.initial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-slate-900 mb-1">{p.name}</div>
        <div className="flex items-center gap-1.5 mb-2">
          {p.verified && (
            <span className="flex items-center gap-0.75 text-[11px] text-green-600 font-medium">
              <CheckIcon color="#16a34a" /> Verified Provider
            </span>
          )}
          <span className="text-slate-400 text-[11px]">•</span>
          <span className="text-[11px] text-slate-500">{p.tag}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.features.map((f) => (
            <span key={f} className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.75 rounded-full border border-slate-200">
              <CheckIcon color="#7c3aed" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex flex-col items-end gap-2.5 shrink-0">
        <div>
          <span className="text-[26px] font-extrabold text-slate-900">${p.price}</span>
          <span className="text-[13px] text-slate-400 font-normal">/mo</span>
        </div>
        <button 
          className={`px-5 py-2.25 rounded-lg text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-opacity duration-200 hover:opacity-90 ${
            p.ctaPrimary 
              ? "bg-linear-to-br from-violet-600 to-violet-800 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]" 
              : "bg-slate-50 text-slate-900 border border-slate-200"
          }`}
        >
          {p.cta}
        </button>
      </div>
    </div>
  );
}

export default PolicyCard;
