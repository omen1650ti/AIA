import React, { useState } from "react";
import { S } from "../InsurancePage/styles/theme";
import { useDispute } from "../../hooks/useDispute";
import BouncingLoader from "../../components/BouncingLoader";
import { Upload, Mail, Copy, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

function DisputePage() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const { loading, error, result, analyzeDispute, resetDispute } = useDispute();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!description || !file) return;
    analyzeDispute({ description, file });
  };

  const handleCopy = () => {
    if (result?.generatedEmail) {
      navigator.clipboard.writeText(result.generatedEmail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleOpenGmail = () => {
    if (result?.generatedEmail) {
      const subject = result.generatedEmail.split("\n")[0].replace("Subject: ", "");
      const body = result.generatedEmail.split("\n").slice(2).join("\n");
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fafbfc] w-full overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white border-b border-slate-100 px-8 py-8 shrink-0">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold text-slate-900 m-0">Dispute Analysis</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Upload your claim rejection document and describe the issue to generate a formal dispute email.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pt-8 pb-12">
        <div className="w-full max-w-4xl px-4 flex flex-col gap-8">
          
          {!result ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col gap-6">
                
                {/* Document Upload */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Upload Rejection Document
                  </label>
                  <label 
                    className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      file ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
                    }`}
                  >
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    <div className={`p-4 rounded-full mb-3 ${file ? "bg-indigo-100" : "bg-white"}`}>
                      <Upload className={file ? "text-indigo-600" : "text-slate-400"} size={28} />
                    </div>
                    {file ? (
                      <div className="text-center">
                        <p className="text-indigo-600 font-bold mb-1">{file.name}</p>
                        <p className="text-slate-500 text-xs">File selected successfully</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-slate-800 font-bold mb-1">Click to upload or drag & drop</p>
                        <p className="text-slate-400 text-sm">PDF, JPG or PNG (max. 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Issue Description
                  </label>
                  <textarea
                    className="w-full h-40 p-4 border border-slate-200 rounded-2xl text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all resize-none font-sans"
                    placeholder="Briefly describe why you are disputing the decision (e.g., 'The medical necessity was clearly documented by my physician but ignored during review.')..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!description || !file || loading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                    !description || !file || loading
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                  }`}
                >
                  {loading ? (
                    <>
                      <BouncingLoader size="h-2 w-2" spacing="space-x-1" inverted />
                      <span>Analyzing Dispute...</span>
                    </>
                  ) : (
                    "Analyze Dispute"
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100 text-red-600">
                    <AlertCircle size={20} />
                    <span className="font-medium">{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle2 className="text-green-600" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                    <p className="text-slate-500">We've generated a formal dispute email for you.</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 relative group overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                   <pre className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed text-[15px]">
                     {result.generatedEmail}
                   </pre>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] border border-slate-200 hover:bg-slate-50 text-slate-700"
                  >
                    {isCopied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                    {isCopied ? "Copied!" : "Copy Email Text"}
                  </button>
                  <button
                    onClick={handleOpenGmail}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <Mail size={20} />
                    Open in Gmail
                  </button>
                </div>

                <button
                  onClick={resetDispute}
                  className="w-full mt-4 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Return to analyzer
                </button>
              </div>

              <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-1">What's Next?</h4>
                  <p className="text-indigo-800/80 text-[15px]">
                    Send this email to your insurer's dispute resolution or support department. Don't forget to attach the same rejection document you uploaded here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisputePage;
