import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { Profile } from "@jobease/shared-types";
import { Plus, Trash2, Save, Check } from "lucide-react";

export const ProfilePages: React.FC = () => {
  const { section = "personal" } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest<{ profile: Profile }>("/profile");
        setProfile(data.profile);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (updatedData: Partial<Profile>) => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const data = await apiRequest<{ profile: Profile }>("/profile", {
        method: "PUT",
        body: JSON.stringify(updatedData)
      });
      setProfile(data.profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <div className="p-8 text-slate-400">Loading profile section...</div>;
  }

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Work Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "preferences", label: "Preferences" }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white capitalize">Profile — {section}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep your profile updated for accurate automatic form field detection.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-sm">
            <Check className="w-4 h-4" />
            <span>Profile saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/profile/${tab.id}`)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              section === tab.id
                ? "border-indigo-500 text-indigo-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section Forms */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        {section === "personal" && (
          <PersonalForm profile={profile} onSave={handleSave} saving={saving} />
        )}
        {section === "education" && (
          <EducationForm profile={profile} onSave={handleSave} saving={saving} />
        )}
        {section === "experience" && (
          <ExperienceForm profile={profile} onSave={handleSave} saving={saving} />
        )}
        {section === "projects" && (
          <ProjectsForm profile={profile} onSave={handleSave} saving={saving} />
        )}
        {section === "skills" && (
          <SkillsForm profile={profile} onSave={handleSave} saving={saving} />
        )}
        {section === "preferences" && (
          <PreferencesForm profile={profile} onSave={handleSave} saving={saving} />
        )}
      </div>
    </div>
  );
};

// 1. Personal Info Form Component
const PersonalForm: React.FC<{ profile: Profile; onSave: (data: any) => void; saving: boolean }> = ({
  profile,
  onSave,
  saving
}) => {
  const [personal, setPersonal] = useState(profile.personal || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ personal });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">First Name</label>
          <input
            type="text"
            value={personal.firstName || ""}
            onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Last Name</label>
          <input
            type="text"
            value={personal.lastName || ""}
            onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
          <input
            type="email"
            value={personal.email || ""}
            onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
          <input
            type="text"
            value={personal.phone || ""}
            onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Current Location (City)</label>
          <input
            type="text"
            value={personal.currentLocation || ""}
            onChange={(e) => setPersonal({ ...personal, currentLocation: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Country</label>
          <input
            type="text"
            value={personal.country || ""}
            onChange={(e) => setPersonal({ ...personal, country: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Address</label>
          <input
            type="text"
            value={personal.address || ""}
            onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Professional Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={personal.links?.linkedin || ""}
              onChange={(e) =>
                setPersonal({
                  ...personal,
                  links: { ...personal.links, linkedin: e.target.value }
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">GitHub URL</label>
            <input
              type="text"
              value={personal.links?.github || ""}
              onChange={(e) =>
                setPersonal({
                  ...personal,
                  links: { ...personal.links, github: e.target.value }
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Portfolio URL</label>
            <input
              type="text"
              value={personal.links?.portfolio || ""}
              onChange={(e) =>
                setPersonal({
                  ...personal,
                  links: { ...personal.links, portfolio: e.target.value }
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Personal Info"}</span>
        </button>
      </div>
    </form>
  );
};

// 2. Education Form Component
const EducationForm: React.FC<{ profile: Profile; onSave: (data: any) => void; saving: boolean }> = ({
  profile,
  onSave,
  saving
}) => {
  const [education, setEducation] = useState(profile.education || []);

  const addEntry = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        cgpa: "",
        percentage: ""
      }
    ]);
  };

  const removeEntry = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ education });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Education Entries ({education.length})
        </h3>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center">
          No education entries added yet. Click "Add Education" above.
        </p>
      )}

      {education.map((item, index) => (
        <div key={index} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 relative">
          <button
            type="button"
            onClick={() => removeEntry(index)}
            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
            title="Remove entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Institution / University</label>
              <input
                type="text"
                value={item.institution}
                onChange={(e) => updateEntry(index, "institution", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Degree</label>
              <input
                type="text"
                value={item.degree}
                onChange={(e) => updateEntry(index, "degree", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Field of Study / Major</label>
              <input
                type="text"
                value={item.fieldOfStudy}
                onChange={(e) => updateEntry(index, "fieldOfStudy", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">CGPA / GPA</label>
              <input
                type="text"
                value={item.cgpa || ""}
                onChange={(e) => updateEntry(index, "cgpa", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Start Date</label>
              <input
                type="text"
                value={item.startDate}
                onChange={(e) => updateEntry(index, "startDate", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">End Date</label>
              <input
                type="text"
                value={item.endDate || ""}
                onChange={(e) => updateEntry(index, "endDate", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                placeholder="MM/YYYY or Present"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Education"}</span>
        </button>
      </div>
    </form>
  );
};

// 3. Work Experience Form Component
const ExperienceForm: React.FC<{ profile: Profile; onSave: (data: any) => void; saving: boolean }> = ({
  profile,
  onSave,
  saving
}) => {
  const [experience, setExperience] = useState(profile.experience || []);

  const addEntry = () => {
    setExperience([
      ...experience,
      {
        id: Date.now().toString(),
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        description: "",
        skillsUsed: []
      }
    ]);
  };

  const removeEntry = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ experience });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Work Experiences ({experience.length})
        </h3>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {experience.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center">
          No work experiences added yet. Click "Add Experience" above.
        </p>
      )}

      {experience.map((item, index) => (
        <div key={index} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 relative">
          <button
            type="button"
            onClick={() => removeEntry(index)}
            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => updateEntry(index, "company", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Job Title</label>
              <input
                type="text"
                value={item.jobTitle}
                onChange={(e) => updateEntry(index, "jobTitle", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Start Date</label>
              <input
                type="text"
                value={item.startDate}
                onChange={(e) => updateEntry(index, "startDate", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">End Date</label>
              <input
                type="text"
                value={item.endDate || ""}
                onChange={(e) => updateEntry(index, "endDate", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={item.description}
                onChange={(e) => updateEntry(index, "description", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Experience"}</span>
        </button>
      </div>
    </form>
  );
};

// 4. Projects Form Component
const ProjectsForm: React.FC<{ profile: Profile; onSave: (data: any) => void; saving: boolean }> = ({
  profile,
  onSave,
  saving
}) => {
  const [projects, setProjects] = useState(profile.projects || []);

  const addEntry = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        projectName: "",
        description: "",
        technologies: [],
        githubUrl: "",
        liveUrl: ""
      }
    ]);
  };

  const removeEntry = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ projects });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Projects ({projects.length})
        </h3>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center">
          No projects added yet. Click "Add Project" above.
        </p>
      )}

      {projects.map((item, index) => (
        <div key={index} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 relative">
          <button
            type="button"
            onClick={() => removeEntry(index)}
            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Project Name</label>
              <input
                type="text"
                value={item.projectName}
                onChange={(e) => updateEntry(index, "projectName", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">GitHub URL</label>
              <input
                type="text"
                value={item.githubUrl || ""}
                onChange={(e) => updateEntry(index, "githubUrl", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateEntry(index, "description", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Projects"}</span>
        </button>
      </div>
    </form>
  );
};

// 5. Skills Form Component
const SkillsForm: React.FC<{ profile: Profile; onSave: (data: any) => void; saving: boolean }> = ({
  profile,
  onSave,
  saving
}) => {
  const [skills, setSkills] = useState({
    technicalSkills: (profile.skills?.technicalSkills || []).join(", "),
    programmingLanguages: (profile.skills?.programmingLanguages || []).join(", "),
    frameworks: (profile.skills?.frameworks || []).join(", "),
    tools: (profile.skills?.tools || []).join(", "),
    softSkills: (profile.skills?.softSkills || []).join(", ")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      skills: {
        technicalSkills: skills.technicalSkills.split(",").map((s) => s.trim()).filter(Boolean),
        programmingLanguages: skills.programmingLanguages.split(",").map((s) => s.trim()).filter(Boolean),
        frameworks: skills.frameworks.split(",").map((s) => s.trim()).filter(Boolean),
        tools: skills.tools.split(",").map((s) => s.trim()).filter(Boolean),
        softSkills: skills.softSkills.split(",").map((s) => s.trim()).filter(Boolean)
      }
    };
    onSave(formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Programming Languages (comma separated)
        </label>
        <input
          type="text"
          value={skills.programmingLanguages}
          onChange={(e) => setSkills({ ...skills, programmingLanguages: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="TypeScript, JavaScript, Python, C++"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Frameworks & Libraries (comma separated)
        </label>
        <input
          type="text"
          value={skills.frameworks}
          onChange={(e) => setSkills({ ...skills, frameworks: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="React, Node.js, Express, Tailwind CSS"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Technical Skills & Concepts (comma separated)
        </label>
        <input
          type="text"
          value={skills.technicalSkills}
          onChange={(e) => setSkills({ ...skills, technicalSkills: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="REST APIs, GraphQL, Microservices, Data Structures"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Tools & Platforms (comma separated)
        </label>
        <input
          type="text"
          value={skills.tools}
          onChange={(e) => setSkills({ ...skills, tools: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="Git, Docker, VS Code, MongoDB"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Soft Skills (comma separated)
        </label>
        <input
          type="text"
          value={skills.softSkills}
          onChange={(e) => setSkills({ ...skills, softSkills: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="Problem Solving, Communication, Teamwork"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Skills"}</span>
        </button>
      </div>
    </form>
  );
};

// 6. Preferences Form Component
const PreferencesForm: React.FC<{ profile: Profile; onSave: (data: any) => void; saving: boolean }> = ({
  profile,
  onSave,
  saving
}) => {
  const [preferences, setPreferences] = useState({
    willingToRelocate: profile.preferences?.willingToRelocate ?? false,
    preferredLocations: (profile.preferences?.preferredLocations || []).join(", "),
    workAuthorizationStatus: profile.preferences?.workAuthorizationStatus || "",
    preferredContactMethod: profile.preferences?.preferredContactMethod || "email"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      preferences: {
        willingToRelocate: preferences.willingToRelocate,
        preferredLocations: preferences.preferredLocations.split(",").map((l) => l.trim()).filter(Boolean),
        workAuthorizationStatus: preferences.workAuthorizationStatus,
        preferredContactMethod: preferences.preferredContactMethod
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
        <input
          type="checkbox"
          id="relocate"
          checked={preferences.willingToRelocate}
          onChange={(e) => setPreferences({ ...preferences, willingToRelocate: e.target.checked })}
          className="w-4 h-4 accent-indigo-600 rounded"
        />
        <label htmlFor="relocate" className="text-sm font-medium text-slate-200 cursor-pointer">
          Willing to relocate for position
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Preferred Locations (comma separated)
        </label>
        <input
          type="text"
          value={preferences.preferredLocations}
          onChange={(e) => setPreferences({ ...preferences, preferredLocations: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="Bangalore, Hyderabad, Remote"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Work Authorization Status
        </label>
        <input
          type="text"
          value={preferences.workAuthorizationStatus}
          onChange={(e) => setPreferences({ ...preferences, workAuthorizationStatus: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
          placeholder="Citizen / Permanent Resident / Requires Visa Sponsorship"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
          Preferred Contact Method
        </label>
        <select
          value={preferences.preferredContactMethod}
          onChange={(e) => setPreferences({ ...preferences, preferredContactMethod: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
        >
          <option value="email">Email</option>
          <option value="phone">Phone Call</option>
          <option value="linkedin">LinkedIn Message</option>
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Preferences"}</span>
        </button>
      </div>
    </form>
  );
};
