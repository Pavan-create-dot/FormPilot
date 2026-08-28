import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Sliders,
  HelpCircle,
  Settings
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile/personal", label: "Personal Info", icon: User },
    { to: "/profile/education", label: "Education", icon: GraduationCap },
    { to: "/profile/experience", label: "Experience", icon: Briefcase },
    { to: "/profile/projects", label: "Projects", icon: FolderGit2 },
    { to: "/profile/skills", label: "Skills", icon: Wrench },
    { to: "/profile/preferences", label: "Preferences", icon: Sliders },
    { to: "/custom-answers", label: "Custom Q&A", icon: HelpCircle },
    { to: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-2 min-h-[calc(100vh-4rem)]">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">
        Navigation
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};
