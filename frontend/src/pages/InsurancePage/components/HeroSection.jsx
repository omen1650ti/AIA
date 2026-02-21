import React from 'react';
import { SparkleIcon } from "./Icons";
import { CATEGORIES } from "../util/constants";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="px-8 pt-9 pb-7 bg-gradient-to-br from-[#faf8ff] to-[#f3f0ff] border-b border-purple-100">

      {/* ── Row 1: Headline (2 cols) + Category Cards (1 col) ── */}
      <div className="grid grid-cols-3 gap-20 items-start mb-5">

        {/* Left — Text block, spans 2 cols */}
        <div className="col-span-2">
          <h1 className="m-0 mb-1 text-[72px] font-bold text-gray-900 tracking-[-0.03em] leading-tight">
            Find the Right 
          </h1>
            <h1 className="m-0 mb-1 text-[72px] font-bold text-gray-900 tracking-[-0.03em] leading-tight">
         Insurance
          </h1>
          <h1 className="m-0 mt-5 mb-3.5 text-[65px] font-bold text-purple-700 tracking-[-0.03em] leading-tight">
            Tailored for Your Life
          </h1>
          
        </div>

        {/* Right — Category cards, spans 1 col */}
        <div className="col-span-1 flex flex-col gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate("/policies")}
              className="px-4 py-4 bg-white border border-purple-100 rounded-2xl cursor-pointer text-left
                         shadow-[0_1px_4px_rgba(109,40,217,0.06)]
                         hover:shadow-[0_4px_16px_rgba(124,58,237,0.14)] hover:border-purple-400
                         transition-all duration-200 flex items-center gap-3"
            >
              <div className="shrink-0">{cat.icon}</div>
              <div>
                <div className="text-sm font-bold text-gray-900 mb-0.5">{cat.label}</div>
                <div className="text-[11px] text-gray-400">{cat.sub}</div>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* ── Row 2: Full-width Risk Analyser banner ── */}
      <div>
        {/* Section label */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[13px] font-semibold text-gray-800">Understand Your Risk</span>
          <span
            title="Our AI analyses your profile to surface gaps in your coverage."
            className="w-4 h-4 rounded-full bg-gray-200 inline-flex items-center justify-center
                       text-[10px] text-gray-400 cursor-default font-bold select-none"
          >
            i
          </span>
        </div>

        {/* Dark card — left content (2/3) + right CTA (1/3) */}
        <div className="grid grid-cols-3 items-center gap-6 px-6 py-[22px]
                        bg-gradient-to-br from-[#1a1333] to-[#12102a] rounded-[18px]
                        shadow-[0_4px_24px_rgba(109,40,217,0.18)]">

          {/* Left — 2 cols */}
          <div className="col-span-2 flex gap-4 items-start">
            {/* Icon badge */}
            <div className="w-[42px] h-[42px] shrink-0 rounded-xl
                            bg-purple-900/30 border border-purple-600/40
                            flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="10" width="3" height="7" rx="1" fill="#a78bfa"/>
                <rect x="8.5" y="6" width="3" height="11" rx="1" fill="#a78bfa"/>
                <rect x="14" y="3" width="3" height="14" rx="1" fill="#c4b5fd"/>
              </svg>
            </div>

            <div>
            <p className="mb-0.5 text-[11px] font-bold text-purple-400 tracking-widest uppercase">
              AI Claim Reviewer
            </p>
            <p className="mb-1.5 text-base font-bold text-white leading-snug">
              Need help with a claim?<br />We've got you covered.
            </p>
            <p className="text-xs text-[#9491b4] leading-relaxed">
              Our AI-powered claim reviewer instantly checks your submission for errors, missing documents, and approval likelihood — before you hit submit.
            </p>
          </div>
        </div>

        {/* Right — 1 col, centred */}
        <div className="col-span-1 flex justify-end items-end pr-10">
          <button
            onClick={() => navigate("/claim-reviewer")}
            className="px-5 py-3.5 bg-gradient-to-br from-purple-600 to-purple-800
                       rounded-md text-white text-sm font-medium flex items-center gap-2
                       whitespace-nowrap shadow-[0_4px_20px_rgba(124,58,237,0.45)]
                       hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,58,237,0.55)]
                       transition-all duration-150 border-0 cursor-pointer"
          >
            Review My Claim Now
          </button>
        </div>

      </div>
      </div>


    </div>
  );
}

export default HeroSection;