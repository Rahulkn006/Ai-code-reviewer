"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Clock, ArrowRight, Star, Loader2, FileCode2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type HistoryItem = {
  id: string;
  createdAt: string;
  result: {
    score?: number;
    summary?: string;
  };
};

export default function HistoryPage() {
  const { status } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => {
          setHistory(data.history || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this analysis?")) return;
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch { /* ignore */ }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-3">Analysis History</h1>
        <p className="text-slate-400">
          View and revisit all your past code reviews.
        </p>
      </div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <FileCode2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">No reviews yet</h2>
          <p className="text-slate-500 mb-6">Submit some code to get your first AI review!</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Start a Review
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          {history.map((item, idx) => {
            const score = item.result?.score;
            const summary = item.result?.summary || "No summary available";
            const date = new Date(item.createdAt);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/analysis/${item.id}`}
                  className="group block bg-[#0f111a]/70 hover:bg-[#151926] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {score !== undefined && (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${
                            score >= 8 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            score >= 5 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            <Star className="w-3.5 h-3.5" />
                            {score}/10
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}
                          {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate group-hover:text-slate-300 transition">
                        {summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item.id); }}
                        className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
