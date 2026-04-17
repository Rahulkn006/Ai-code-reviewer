"use client";

import InputSection from "@/components/InputSection";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleAnalyze = async (type: string, payload: string) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, code: payload }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await res.json();
      if (data.id) {
        router.push(`/analysis/${data.id}`);
      }
    } catch (e: unknown) {
      alert(`Network Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-3">Code Review Workspace</h1>
        <p className="text-slate-400">
          Paste your code, link a GitHub repository, or upload a code document (PDF) to get an instant AI review.
        </p>
      </div>
      <InputSection onAnalyze={handleAnalyze} />
    </div>
  );
}
