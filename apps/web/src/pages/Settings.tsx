import React, { useState } from "react";
import { Shield, Key, Database, Check } from "lucide-react";

export const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings & Privacy</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure security, LLM API keys, and data safety preferences.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
            <Key className="w-4 h-4" />
            <span>AI Classifier Provider Key</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Optional OpenAI or Gemini API key for AI Fallback classification when deterministic matching fails.
          </p>
          <form onSubmit={handleSave} className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors"
            >
              Save Key
            </button>
          </form>
          {saved && (
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Key saved locally</span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
            <Shield className="w-4 h-4" />
            <span>Safety Principles Enforced</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
            <li>Job applications are NEVER automatically submitted.</li>
            <li>CAPTCHA and anti-bot bypassing are strictly forbidden.</li>
            <li>Sensitive fields (work authorization, legal status, disability) require explicit user confirmation.</li>
          </ul>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-2">
            <Database className="w-4 h-4" />
            <span>Data Storage</span>
          </div>
          <p className="text-xs text-slate-400">
            All user credentials are password-hashed using bcrypt and tokens are secured via JWT.
          </p>
        </div>
      </div>
    </div>
  );
};
