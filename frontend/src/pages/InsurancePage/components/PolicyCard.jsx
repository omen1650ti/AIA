import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Hospital,
  Clock,
  IndianRupee,
  Star,
} from "lucide-react";

const PolicyCard = ({ policy, onClick }) => {
  const { jsonb_data, base_price } = policy;
  const features = jsonb_data?.features || {};

  return (
    <div
      onClick={onClick}
      className="w-full bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group mb-4"
    >
      {/* Left Section: Icon and Details */}
      <div className="flex items-start gap-6 w-full md:w-auto">

        <div className="flex flex-col gap-3 grow">
          {/* Title and Badges */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {jsonb_data?.plan_name}
              </h3>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                {jsonb_data?.plan_type}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <ShieldCheck size={16} />
                {jsonb_data?.claim_settlement_ratio_percent}% CSR
              </span>
              <span className="flex items-center gap-1.5">
                <Hospital size={16} className="text-slate-400" />
                {jsonb_data?.cashless_hospitals?.toLocaleString()}+ Hospitals
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-slate-400" />
                {jsonb_data?.existing_waiting_period_yrs} years waiting
              </span>
            </div>
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {features.free_checkup && (
              <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 italic">
                <CheckCircle2 size={12} className="text-emerald-500" /> Free
                Checkup
              </span>
            )}
            {features.maternity_cover && (
              <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 italic">
                <CheckCircle2 size={12} className="text-emerald-500" />{" "}
                Maternity
              </span>
            )}
            {features.ayush && (
              <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 italic">
                <CheckCircle2 size={12} className="text-emerald-500" /> AYUSH
              </span>
            )}
            {features.air_evacuation && (
              <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 italic">
                <CheckCircle2 size={12} className="text-emerald-500" /> Air
                Evacuation
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Price and Action */}
      <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Starting from
          </span>
          <div className="flex items-center text-3xl font-black text-slate-900">
            <IndianRupee size={24} className="mr-0.5" />
            {base_price?.toLocaleString()}
            <span className="text-slate-400 text-sm font-medium ml-1">
              /year
            </span>
          </div>
        </div>
        <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-100">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;
