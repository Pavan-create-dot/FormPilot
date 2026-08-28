import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Scan, Play, LogIn } from "lucide-react";

export const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [completeness, setCompleteness] = useState<number>(0);
  const [detectedCount, setDetectedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenInput, setTokenInput] = useState<string>("");

  useEffect(() => {
    // 1. Fetch profile status from background worker
    chrome.runtime.sendMessage({ type: "GET_PROFILE" }, (res) => {
      if (res && res.authenticated) {
        setAuthenticated(true);
        setProfile(res.profile);
        setCompleteness(res.completeness);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    // 2. Query active tab for detected form fields
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "DETECT_FIELDS_COUNT" }, (res) => {
          if (res && typeof res.count === "number") {
            setDetectedCount(res.count);
          }
        });
      }
    });
  }, []);

  const handleSaveToken = () => {
    if (!tokenInput.trim()) return;
    chrome.runtime.sendMessage({ type: "SET_TOKEN", payload: { token: tokenInput.trim() } }, () => {
      window.location.reload();
    });
  };

  const handleScanAndAutofill = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "SCAN_AND_REVIEW" });
        window.close(); // Close popup so user sees review modal overlay
      }
    });
  };

  if (loading) {
    return <div className="p-4 text-xs text-slate-400">Loading JobEase popup...</div>;
  }

  return (
    <div className="p-4 bg-slate-950 text-slate-100 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-4 h-4 text-indigo-200" />
          </div>
          <span className="font-bold text-base text-white tracking-tight">JobEase</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          v1.0
        </span>
      </div>

      {!authenticated ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Not Connected to Dashboard</span>
          </div>
          <p className="text-slate-400">
            Log in to the web dashboard at <strong className="text-slate-200">http://localhost:5173</strong> or paste your JWT token below:
          </p>
          <input
            type="password"
            placeholder="Paste JWT Token..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none text-xs"
          />
          <button
            onClick={handleSaveToken}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Connect Extension</span>
          </button>
        </div>
      ) : (
        <>
          {/* Profile Status Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Profile Status</span>
              <span className="text-indigo-400 font-bold">{completeness}% Complete</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.personal?.firstName ? "text-emerald-400" : "text-slate-600"}`} />
                <span>Personal Information</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.education?.length > 0 ? "text-emerald-400" : "text-slate-600"}`} />
                <span>Education</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.experience?.length > 0 ? "text-emerald-400" : "text-slate-600"}`} />
                <span>Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.skills?.technicalSkills?.length > 0 ? "text-emerald-400" : "text-slate-600"}`} />
                <span>Skills</span>
              </div>
            </div>
          </div>

          {/* Current Page Detector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
            <span className="font-semibold text-slate-300 block uppercase tracking-wider text-[10px]">
              Current Page Detection
            </span>
            {detectedCount > 0 ? (
              <div className="flex items-center justify-between text-emerald-400 font-medium">
                <span>Job Application Detected</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                  {detectedCount} fields
                </span>
              </div>
            ) : (
              <div className="text-slate-400">No form fields detected on current page.</div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleScanAndAutofill}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-lg shadow-indigo-600/30"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Application</span>
            </button>
            <button
              onClick={handleScanAndAutofill}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs border border-slate-700"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Autofill Form</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
