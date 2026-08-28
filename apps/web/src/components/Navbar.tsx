import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-indigo-200" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">JobEase</span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="font-medium">{user.email}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
