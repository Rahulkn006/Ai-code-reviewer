"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center px-6">

      {/* LOGIN CARD */}
      <div className="mt-20 bg-[#111827] border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Get Started — It's Free
        </h1>
        <p className="text-gray-400 mb-6">
          Sign in with Google to start reviewing code instantly.
        </p>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          <span>🔵</span>
          Sign in with Google
        </button>

        <button
          onClick={() => signIn("github")}
          className="mt-3 w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          <span>🐙</span>
          Sign in with GitHub
        </button>
      </div>

      {/* FEATURES SECTION */}
      <div className="mt-16 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold text-center mb-10">
          What AI Code Reviewer Does
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🐛 Bug Detection</h3>
            <p className="text-gray-400">
              Detect runtime errors, logical issues, and potential bugs with precision.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">💡 Smart Suggestions</h3>
            <p className="text-gray-400">
              Get improvements and clean code recommendations from an AI engineer.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">⭐ Quality Score</h3>
            <p className="text-gray-400">
              Receive a score with strengths and weaknesses explained clearly.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">📘 Documentation</h3>
            <p className="text-gray-400">
              Auto-generate documentation for your code effortlessly.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🔗 GitHub Integration</h3>
            <p className="text-gray-400">
              Analyze full repositories by simply pasting a GitHub link.
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">📥 Export Reports</h3>
            <p className="text-gray-400">
              Download detailed reports of your code reviews.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
