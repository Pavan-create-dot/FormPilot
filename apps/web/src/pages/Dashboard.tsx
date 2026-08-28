import React, { useEffect, useState } from "react";
import { ProfileCompletenessBar } from "../components/ProfileCompletenessBar";
import { apiRequest } from "../api/client";
import { Profile, CustomAnswer } from "@jobease/shared-types";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  FolderGit2,
  HelpCircle,
  Chrome,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completeness, setCompleteness] = useState<number>(0);
  const [customAnswersCount, setCustomAnswersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pData = await apiRequest<{ profile: Profile; completeness: number }>("/profile");
        setProfile(pData.profile);
        setCompleteness(pData.completeness);

        const caData = await apiRequest<{ customAnswers: CustomAnswer[] }>("/custom-answers");
        setCustomAnswersCount(caData.customAnswers.length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    {
      title: "Education Entries",
      count: profile?.education?.length || 0,
      link: "/profile/education",
      icon: GraduationCap,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Work Experience",
      count: profile?.experience?.length || 0,
      link: "/profile/experience",
      icon: Briefcase,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Projects Added",
      count: profile?.projects?.length || 0,
      link: "/profile/projects",
      icon: FolderGit2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Saved Custom Q&A",
      count: customAnswersCount,
      link: "/custom-answers",
      icon: HelpCircle,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">
          Welcome to JobEase! Manage your professional profile and extension settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileCompletenessBar percentage={completeness} />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Chrome className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">Chrome Extension</h3>
              <p className="text-xs text-slate-400">Autofill job application forms</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready to connect with Chrome extension</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-white">{card.count}</div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">{card.title}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Profile Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Info Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-500 text-xs block uppercase">Full Name</span>
            <span className="text-slate-200 font-medium">
              {profile?.personal?.firstName || profile?.personal?.lastName
                ? `${profile.personal.firstName} ${profile.personal.lastName}`
                : "Not set"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block uppercase">Contact Phone</span>
            <span className="text-slate-200 font-medium">
              {profile?.personal?.phone || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block uppercase">Current Location</span>
            <span className="text-slate-200 font-medium">
              {profile?.personal?.currentLocation || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block uppercase">LinkedIn</span>
            <span className="text-slate-200 font-medium truncate block">
              {profile?.personal?.links?.linkedin || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block uppercase">GitHub</span>
            <span className="text-slate-200 font-medium truncate block">
              {profile?.personal?.links?.github || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block uppercase">Work Authorization</span>
            <span className="text-slate-200 font-medium">
              {profile?.preferences?.workAuthorizationStatus || "Not set"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
