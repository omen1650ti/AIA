import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Hospital,
  Clock,
  IndianRupee,
} from "lucide-react";

const PolicyCard = ({ policy, onClick, isMyPolicyChat }) => {
  const { jsonb_data, base_price } = policy;
  const features = jsonb_data?.features || {};

  return (
    <div
      onClick={onClick}
      className="w-full bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col gap-6 transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer group relative overflow-hidden h-full"
    >
      {/* Top Section: Icon and Title */}
      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
            {jsonb_data?.plan_name}
          </h3>
          <p className="text-sm text-slate-400 font-medium line-clamp-1">
            {policy.insurer || "Premium Protection Plan"}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 py-4 border-y border-slate-50">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <ShieldCheck size={18} className="text-emerald-500" />
            Trust Score
          </span>
          <span className="font-bold text-slate-900">
            {jsonb_data?.claim_settlement_ratio_percent}% CSR
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Hospital size={18} className="text-blue-500" />
            Network
          </span>
          <span className="font-bold text-slate-900">
            {jsonb_data?.cashless_hospitals?.toLocaleString()}+ Hospitals
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Clock size={18} className="text-amber-500" />
            Waiting Period
          </span>
          <span className="font-bold text-slate-900">
            {jsonb_data?.existing_waiting_period_yrs} years
          </span>
        </div>
      </div>

      {/* Features Badges */}
      <div className="flex flex-wrap gap-2">
        {features.free_checkup && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
            <CheckCircle2 size={12} className="text-emerald-500" /> Free Checkup
          </span>
        )}
        {features.maternity_cover && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
            <CheckCircle2 size={12} className="text-emerald-500" /> Maternity
          </span>
        )}
        {features.ayush && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
            <CheckCircle2 size={12} className="text-emerald-500" /> AYUSH
          </span>
        )}
        {features.air_evacuation && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
            <CheckCircle2 size={12} className="text-emerald-500" /> Air Evac
          </span>
        )}
      </div>

      {/* Price and Action Section */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
            ANNUAL PREMIUM
          </span>
          <div className="flex items-baseline text-3xl font-black text-slate-900">
            <IndianRupee size={20} className="mr-0.5 text-indigo-600" />
            {base_price?.toLocaleString()}
            <span className="text-slate-400 text-sm font-medium ml-1">
              /year
            </span>
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200">
          View Policy Details
        </button>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50/30 rounded-full blur-2xl group-hover:bg-indigo-100/40 transition-colors" />
    </div>
  );
};

export default PolicyCard;
