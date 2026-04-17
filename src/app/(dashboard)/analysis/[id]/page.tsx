"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResultsDisplay, { AnalysisResult } from "@/components/ResultsDisplay";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Loader2, Download } from "lucide-react";

export default function AnalysisPage() {
  const { id } = useParams();
  const { status } = useSession();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetch(`/api/history/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch analysis");
          return res.json();
        })
        .then((data) => {
          setResult(data.analysis.result);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setError("Unauthorized. Please log in.");
      setLoading(false);
    }
  }, [id, status]);

  const handleExport = () => {
    if (!result) return;
    const md = `# Code Review Report\n\n**Score:** ${result.score ?? "N/A"}/10\n\n## Summary\n${result.summary ?? "No summary available."}\n\n## Bugs Found\n${(result.bugs ?? []).map(b => `- **[${b.severity}]** ${b.type}: ${b.message}`).join("\n") || "No bugs detected."}\n\n## Suggestions\n${(result.suggestions ?? []).map(s => `- ${s}`).join("\n") || "No suggestions."}\n\n## Metrics\n- Complexity: ${result.metrics?.complexity ?? "N/A"}\n- Readability: ${result.metrics?.readability ?? "N/A"}\n- Maintainability: ${result.metrics?.maintainability ?? "N/A"}\n\n## Refactored Code\n\`\`\`\n${result.refactored_code ?? "N/A"}\n\`\`\`\n\n## Documentation\n${result.documentation ?? "N/A"}`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-${id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-slate-500 text-sm">Loading analysis...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-rose-400 mb-3">Error</h2>
          <p className="text-slate-400 mb-6">{error || "Analysis not found."}</p>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="py-6 flex items-center justify-between">
        <Link
          href="/history"
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#0f111a] hover:bg-[#151926] border border-white/10 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <Download className="w-4 h-4" />
          Export as Markdown
        </button>
      </div>

      <ResultsDisplay result={result} />
    </div>
  );
}
