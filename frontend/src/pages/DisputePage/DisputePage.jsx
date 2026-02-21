import React, { useState } from "react";
import { S } from "../InsurancePage/styles/theme";
import { useDispute } from "../../hooks/useDispute";
import BouncingLoader from "../../components/BouncingLoader";
import { Upload, Mail, Copy, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

function DisputePage() {
  const [claimFile, setClaimFile] = useState(null);
  const [rejectionFile, setRejectionFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { loading, error, result, analyzeDispute, resetDispute } = useDispute();

  const handleClaimFile = (e) => {
    if (e.target.files && e.target.files[0]) setClaimFile(e.target.files[0]);
  };

  const handleRejectionFile = (e) => {
    if (e.target.files && e.target.files[0]) setRejectionFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!claimFile || !rejectionFile) return;
    analyzeDispute({ claimFile, rejectionFile, description });
  };

  const handleCopy = () => {
    if (result?.dispute_mail) {
      navigator.clipboard.writeText(result.dispute_mail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleOpenGmail = () => {
    if (result?.dispute_mail) {
      const subjectLine = result.dispute_mail.split("\n").find(l => l.startsWith("Subject:"));
      const subject = subjectLine ? subjectLine.replace("Subject: ", "") : "Dispute Regarding Insurance Claim";
      const body = result.dispute_mail.split("\n").slice(2).join("\n");
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    }
  };

  const DataSection = ({ title, data }) => (
    <div className="mb-6">
      <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">{title}</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-semibold">{key}</span>
            <span className="text-sm text-slate-800 font-bold break-all">{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const formatEmail = (text) => {
    if (!text) return "";
    // Remove markdown bold syntax **
    return text.replace(/\*\*/g, "");
  };

  return (
    <div className="flex flex-col h-full bg-[#fafbfc] w-full overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white border-b border-slate-100 px-8 py-8 shrink-0">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold text-slate-900 m-0">Dispute Analysis</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Upload your plan and bill documents to generate a formal dispute email with AI analysis.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pt-8 pb-12">
        <div className="w-full max-w-4xl px-4 flex flex-col gap-8">
          
          {!result ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col gap-8">
                
                {/* Dual Document Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Claim Document */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      1. Document Plan
                    </label>
                    <label 
                      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all h-48 ${
                        claimFile ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
                      }`}
                    >
                      <input type="file" className="hidden" onChange={handleClaimFile} />
                      <div className={`p-3 rounded-full mb-3 ${claimFile ? "bg-indigo-100" : "bg-white"}`}>
                        <Upload className={claimFile ? "text-indigo-600" : "text-slate-400"} size={24} />
                      </div>
                      <div className="text-center px-4">
                        <p className={`font-bold text-sm truncate max-w-[200px] ${claimFile ? "text-indigo-600" : "text-slate-800"}`}>
                          {claimFile ? claimFile.name : "Upload Original Claim"}
                        </p>
                        {!claimFile && <p className="text-slate-400 text-xs mt-1">PDF or Image</p>}
                      </div>
                    </label>
                  </div>

                  {/* Rejection Document */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      2. Hospital Bill
                    </label>
                    <label 
                      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all h-48 ${
                        rejectionFile ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
                      }`}
                    >
                      <input type="file" className="hidden" onChange={handleRejectionFile} />
                      <div className={`p-3 rounded-full mb-3 ${rejectionFile ? "bg-indigo-100" : "bg-white"}`}>
                        <Upload className={rejectionFile ? "text-indigo-600" : "text-slate-400"} size={24} />
                      </div>
                      <div className="text-center px-4">
                        <p className={`font-bold text-sm truncate max-w-[200px] ${rejectionFile ? "text-indigo-600" : "text-slate-800"}`}>
                          {rejectionFile ? rejectionFile.name : "Upload Rejection Proof"}
                        </p>
                        {!rejectionFile && <p className="text-slate-400 text-xs mt-1">PDF or Image</p>}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Optional Description */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Issue
                  </label>
                  <textarea
                    className="w-full h-24 p-4 border border-slate-200 rounded-2xl text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all resize-none font-sans text-sm"
                    placeholder="Briefly describe why you are disputing the decision..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!claimFile || !rejectionFile || loading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                    !claimFile || !rejectionFile || loading
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                  }`}
                >
                  {loading ? (
                    <>
                      <BouncingLoader size="h-2 w-2" spacing="space-x-1" inverted />
                      <span>Running Analysis...</span>
                    </>
                  ) : (
                    "Analyze & Generate Dispute"
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 text-sm">
                    <AlertCircle size={18} />
                    <span className="font-bold">{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm w-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle2 className="text-green-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                    <p className="text-slate-500">Professional dispute template generated.</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 relative group overflow-hidden shadow-2xl">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                   <pre className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed text-[15px]">
                     {formatEmail(result.dispute_mail)}
                   </pre>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all active:scale-[0.95] border-2 border-slate-100 hover:bg-slate-50 text-slate-700"
                  >
                    {isCopied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                    {isCopied ? "Copied!" : "Copy Text"}
                  </button>
                  <button
                    onClick={handleOpenGmail}
                    className="flex-1 py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all active:scale-[0.95] bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                  >
                    <Mail size={20} />
                    Send via Gmail
                  </button>
                </div>

                {/* Hardcoded Next Steps Card */}
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-indigo-600" />
                    What should I do next?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black">1</div>
                      <p className="text-xs text-slate-600 font-bold">Review the email and fill in any bracketed information [like dates].</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black">2</div>
                      <p className="text-xs text-slate-600 font-bold">Attach your primary Plan Document and the Hospital Bill to the email.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black">3</div>
                      <p className="text-xs text-slate-600 font-bold">Send to your insurer's grievance cell and track the reference number.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setClaimFile(null);
                    setRejectionFile(null);
                    resetDispute();
                  }}
                  className="w-full mt-8 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
                >
                  Start New Analysis
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisputePage;
