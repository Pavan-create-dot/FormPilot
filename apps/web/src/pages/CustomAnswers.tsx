import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { CustomAnswer } from "@jobease/shared-types";
import { Plus, Trash2, HelpCircle, Search } from "lucide-react";

export const CustomAnswers: React.FC = () => {
  const [answers, setAnswers] = useState<CustomAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const loadAnswers = async () => {
    try {
      const data = await apiRequest<{ customAnswers: CustomAnswer[] }>("/custom-answers");
      setAnswers(data.customAnswers);
    } catch (err) {
      console.error("Failed to load custom answers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom answer?")) return;
    try {
      await apiRequest(`/custom-answers/${id}`, { method: "DELETE" });
      setAnswers(answers.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete custom answer", err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;
    try {
      const data = await apiRequest<{ customAnswer: CustomAnswer }>("/custom-answers", {
        method: "POST",
        body: JSON.stringify({
          originalQuestion: newQuestion,
          answer: newAnswer,
          fieldType: "text"
        })
      });
      setAnswers([data.customAnswer, ...answers]);
      setNewQuestion("");
      setNewAnswer("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add custom answer", err);
    }
  };

  const filteredAnswers = answers.filter(
    (a) =>
      a.originalQuestion.toLowerCase().includes(search.toLowerCase()) ||
      String(a.answer).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Custom Answers</h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic answers saved for unusual job application questions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Answer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stored questions or answers..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading custom answers...</div>
      ) : filteredAnswers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 font-medium">No custom answers found.</p>
          <p className="text-xs text-slate-500 mt-1">
            When you answer new questions on job forms, click "Remember my answer" to save them here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="divide-y divide-slate-800">
            {filteredAnswers.map((ca) => (
              <div key={ca.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-200">{ca.originalQuestion}</div>
                  <div className="text-sm text-indigo-400 font-medium">
                    Answer: <span className="text-slate-300">{String(ca.answer)}</span>
                  </div>
                  {ca.lastUsedAt && (
                    <div className="text-xs text-slate-500">
                      Last used: {new Date(ca.lastUsedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(ca.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete answer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for adding custom answer manually */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Custom Q&A Pair</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Original Question
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. Are you willing to travel up to 25%?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Your Saved Answer
                </label>
                <input
                  type="text"
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. Yes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                  Save Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
