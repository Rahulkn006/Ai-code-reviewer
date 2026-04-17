"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-6">

      {/* LOGIN CARD */}
      <div className="mt-20 bg-card border border-border rounded-2xl p-8 w-full max-w-md text-center shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Get Started &mdash; It&apos;s Free
        </h1>
        <p className="text-muted-foreground mb-6">
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
          className="mt-3 w-full flex items-center justify-center gap-3 bg-secondary border border-border py-3 rounded-lg font-medium hover:opacity-80 transition"
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

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🐛 Bug Detection</h3>
            <p className="text-muted-foreground">
              Detect runtime errors, logical issues, and potential bugs with precision.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">💡 Smart Suggestions</h3>
            <p className="text-muted-foreground">
              Get improvements and clean code recommendations from an AI engineer.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">⭐ Quality Score</h3>
            <p className="text-muted-foreground">
              Receive a score with strengths and weaknesses explained clearly.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">📘 Documentation</h3>
            <p className="text-muted-foreground">
              Auto-generate documentation for your code effortlessly.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🔗 GitHub Integration</h3>
            <p className="text-muted-foreground">
              Analyze full repositories by simply pasting a GitHub link.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">📥 Export Reports</h3>
            <p className="text-muted-foreground">
              Download detailed reports of your code reviews.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
