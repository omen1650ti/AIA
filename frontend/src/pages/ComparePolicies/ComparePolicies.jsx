import React, { useState, useMemo } from "react";
import { useGetPolicies } from "../../hooks/usePolicies";
import { useComparePolicies } from "../../hooks/useComparePolicies";
import BouncingLoader from "../../components/BouncingLoader";
import { ArrowLeftRight, ChevronDown, CheckCircle2, AlertCircle, Zap, Shield, Sparkles } from "lucide-react";

function ComparePolicies() {
  const { data: policies = [], isLoading: loadingPolicies } = useGetPolicies();
  const compareMutation = useComparePolicies();
  
  const [selectedPlan1, setSelectedPlan1] = useState("");
  const [selectedPlan2, setSelectedPlan2] = useState("");

  const handleCompare = () => {
    if (!selectedPlan1 || !selectedPlan2) return;
    compareMutation.mutate({
      policy1_id: selectedPlan1,
      policy2_id: selectedPlan2
    });
  };

  const plan1 = useMemo(() => policies.find(p => p.id === selectedPlan1), [policies, selectedPlan1]);
  const plan2 = useMemo(() => policies.find(p => p.id === selectedPlan2), [policies, selectedPlan2]);

  return (
    <div className="flex flex-col h-full bg-[#fafbfc] w-full overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white border-b border-slate-100 px-8 py-8 shrink-0">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <ArrowLeftRight size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 m-0">Compare Policies</h1>
          </div>
          <p className="text-slate-500 text-lg">
            Select two insurance plans to see a detailed, AI-powered comparison of their benefits and costs.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pt-8 pb-12">
        <div className="w-full max-w-5xl px-4 flex flex-col gap-8">
          
          {/* Selection Box */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              
              {/* Plan 1 Dropdown */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select First Plan</label>
                <div className="relative">
                  <select
                    value={selectedPlan1}
                    onChange={(e) => setSelectedPlan1(e.target.value)}
                    className="w-full appearance-none px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Choose a policy...</option>
                    {policies.map(p => (
                      <option key={p.id} value={p.id} disabled={p.id === selectedPlan2}>
                        {p.insurer} - {p.plan_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center pt-6">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black italic tracking-tighter text-sm">
                   VS
                 </div>
              </div>

              {/* Plan 2 Dropdown */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select Second Plan</label>
                <div className="relative">
                  <select
                    value={selectedPlan2}
                    onChange={(e) => setSelectedPlan2(e.target.value)}
                    className="w-full appearance-none px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Choose a policy...</option>
                    {policies.map(p => (
                      <option key={p.id} value={p.id} disabled={p.id === selectedPlan1}>
                        {p.insurer} - {p.plan_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

            </div>

            {/* Compare Button */}
            <button
              onClick={handleCompare}
              disabled={!selectedPlan1 || !selectedPlan2 || compareMutation.isPending}
              className={`w-full mt-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                !selectedPlan1 || !selectedPlan2 || compareMutation.isPending
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-slate-900 shadow-xl shadow-indigo-100"
              }`}
            >
              {compareMutation.isPending ? (
                <>
                  <BouncingLoader size="h-2 w-2" spacing="space-x-1" inverted />
                  <span>Analyzing Plans...</span>
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-current" />
                  Compare Plans
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          {compareMutation.isPending && (
             <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-60">
                <BouncingLoader size="h-4 w-4" spacing="space-x-3" />
                <p className="text-slate-500 font-bold animate-pulse">Our AI is crunching the plan details for you...</p>
             </div>
          )}

          {compareMutation.isError && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4 text-red-600">
               <AlertCircle className="shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-bold">Comparison Failed</h4>
                 <p className="text-sm opacity-80">We couldn't compare these plans. Please try again later.</p>
               </div>
            </div>
          )}

          {compareMutation.isSuccess && compareMutation.data && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-6">
                {[plan1, plan2].map((plan, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 opacity-20" />
                    <div className="flex items-center gap-2 text-indigo-600 mb-3">
                       <Shield size={16} />
                       <span className="text-xs font-black uppercase tracking-widest">Plan {idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {plan?.plan_name}
                    </h3>
                    <p className="text-slate-500 font-bold text-sm mt-1">{plan?.insurer}</p>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-baseline gap-1">
                       <span className="text-slate-400 text-sm font-bold">Starts at</span>
                       <span className="text-2xl font-black text-slate-900">₹{plan?.base_price?.toLocaleString()}</span>
                       <span className="text-slate-400 text-sm font-bold">/yr</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Result */}
              <div className="bg-slate-900 rounded-[32px] p-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <Sparkles className="text-indigo-400" size={24} />
                  </div>
                   <h2 className="text-2xl font-black text-white">AI Comparison Insight</h2>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg font-medium opacity-90">
                    {typeof compareMutation.data === 'string' 
                      ? compareMutation.data 
                      : compareMutation.data.analysis || JSON.stringify(compareMutation.data, null, 2)}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Generated by AIA Intelligence</p>
                   <button 
                    onClick={() => window.print()}
                    className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                   >
                     Download Comparison
                   </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ComparePolicies;
