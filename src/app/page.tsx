"use client"

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { Bug, Lightbulb, Star, BookOpen, Link as LinkIcon, Download } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-2xl">Loading Auth State...</div>
  }

  if (status === "authenticated") {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-2xl">Redirecting to Dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        {/* Glow Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        {/* HERO SECTION */}
        <div className="relative z-10 flex flex-col items-center pt-24 px-6 max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-tr from-primary to-amber-600 p-3 rounded-2xl shadow-lg shadow-primary/20">
              <pre className="text-primary-foreground font-mono font-bold text-xl leading-none">{'< >'}</pre>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center">
              Review<span className="text-primary">IQ</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Your 24/7 AI-powered senior developer. Paste code or link a repo — get expert-level bug reports, refactoring suggestions, and documentation in seconds.
          </p>

          {/* LOGIN CARD */}
          <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-amber-600" />
            
            <h2 className="text-2xl font-bold text-white mb-2">Get Started &mdash; It&apos;s Free</h2>
            <p className="text-slate-400 text-sm mb-8">Sign in with Google to start reviewing code instantly.</p>

            <div className="space-y-4">
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>

              <button
                onClick={() => signIn("github")}
                className="w-full flex items-center justify-center gap-3 bg-[#1e2330] border border-white/5 text-white py-3.5 rounded-xl font-semibold hover:bg-[#252b3b] transition duration-200"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Sign in with GitHub
              </button>

              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={() => signIn("credentials")}
                  className="w-full flex items-center justify-center gap-3 bg-red-600/20 text-red-400 border border-red-500/30 py-3.5 rounded-xl font-semibold hover:bg-red-600/30 transition duration-200 mt-4"
                >
                  <Bug className="w-5 h-5" />
                  Local Dev Login (Bypass Auth)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 mt-32 pb-24 border-t border-white/5 pt-16">
          <h3 className="text-3xl font-bold text-center text-white mb-12">What <span className="text-primary">ReviewIQ</span> Does</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-card/50 hover:bg-secondary border border-white/5 p-8 rounded-2xl transition duration-300 group">
              <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition shrink-0">
                <Bug className="text-emerald-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Bug Detection</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                AI finds potential bugs and runtime errors with severity ratings and line-level precision.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-card/50 hover:bg-secondary border border-white/5 p-8 rounded-2xl transition duration-300 group">
              <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition shrink-0">
                <Lightbulb className="text-amber-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Smart Suggestions</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Get before/after code improvements and refactoring advice from a senior engineer perspective.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-card/50 hover:bg-secondary border border-white/5 p-8 rounded-2xl transition duration-300 group">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition shrink-0">
                <Star className="text-primary w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Quality Score</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Receive a 1-10 quality rating with detailed explanations of strengths and weaknesses in your structure.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-card/50 hover:bg-secondary border border-white/5 p-8 rounded-2xl transition duration-300 group">
              <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition shrink-0">
                <BookOpen className="text-blue-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Auto Documentation</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Automatically generate robust docs explaining what each function and module does to save you hours of writing.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-card/50 hover:bg-secondary border border-white/5 p-8 rounded-2xl transition duration-300 group">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition shrink-0">
                <LinkIcon className="text-primary w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">GitHub Integration</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Paste code or seamlessly enter a public GitHub repo URL — we automatically fetch and analyze the files for you.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-card/50 hover:bg-secondary border border-white/5 p-8 rounded-2xl transition duration-300 group">
               <div className="bg-rose-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-rose-500/20 group-hover:scale-110 transition shrink-0">
                <Download className="text-rose-400 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Export Reports</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Download your full automated review board as a clean Markdown file for documentation or team sharing.
              </p>
            </div>

          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="relative z-10 bg-background/50 py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-16">How It Works</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative">
              {/* Connector Line for larger screens */}
              <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="flex flex-col items-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] mb-6">1</div>
                <h4 className="text-lg font-bold text-white mb-2">Sign In</h4>
                <p className="text-slate-500 text-sm">Authenticate securely with Google or GitHub.</p>
              </div>

              <div className="flex flex-col items-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] mb-6">2</div>
                <h4 className="text-lg font-bold text-white mb-2">Submit Code</h4>
                <p className="text-muted-foreground text-sm">Paste any code snippet or link a repository.</p>
              </div>

              <div className="flex flex-col items-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] mb-6">3</div>
                <h4 className="text-lg font-bold text-white mb-2">AI Reviews</h4>
                <p className="text-muted-foreground text-sm">Llama-3 & Gemini analyze for code quality & bugs.</p>
              </div>

              <div className="flex flex-col items-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] mb-6">4</div>
                <h4 className="text-lg font-bold text-white mb-2">Get Results</h4>
                <p className="text-muted-foreground text-sm">Instant bug reports, fixes, score, and docs.</p>
              </div>
            </div>
            
          </div>
        </div>
    </div>
  )
}
