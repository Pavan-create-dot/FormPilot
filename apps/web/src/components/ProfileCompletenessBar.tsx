import React from "react";

interface ProfileCompletenessBarProps {
  percentage: number;
}

export const ProfileCompletenessBar: React.FC<ProfileCompletenessBarProps> = ({ percentage }) => {
  const getColor = () => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-300">Profile Completion</span>
        <span className="text-sm font-bold text-slate-100">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage < 100 && (
        <p className="text-xs text-slate-400 mt-2">
          Fill remaining profile sections to improve autofill confidence on application forms.
        </p>
      )}
    </div>
  );
};
