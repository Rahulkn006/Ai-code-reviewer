"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { User, Palette, Shield, LogOut, Loader2, ChevronRight, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("profile");

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: Shield },
  ];

  const themeOptions = [
    { id: "dark", label: "Dark", icon: Moon, desc: "Dark background with light text" },
    { id: "light", label: "Light", icon: Sun, desc: "Light background with dark text" },
    { id: "system", label: "System", icon: Monitor, desc: "Follow system preferences" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === section.id
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
              <ChevronRight className={`w-4 h-4 ml-auto transition ${activeSection === section.id ? "text-indigo-400" : "text-transparent"}`} />
            </button>
          ))}
        </nav>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeSection === "profile" && (
            <div className="bg-[#0f111a]/70 border border-white/5 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
              
              <div className="flex items-center gap-5">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-2xl border-2 border-indigo-500/30"
                    unoptimized
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {session?.user?.name?.[0] || "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{session?.user?.name || "User"}</h3>
                  <p className="text-sm text-slate-400">{session?.user?.email || "No email"}</p>
                </div>
              </div>

              <div className="grid gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                  <div className="bg-[#1a1d2e] border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300">
                    {session?.user?.name || "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <div className="bg-[#1a1d2e] border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300">
                    {session?.user?.email || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="bg-[#0f111a]/70 border border-white/5 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Appearance</h2>
              <p className="text-sm text-slate-400">Choose your preferred theme for the application.</p>

              <div className="grid gap-3 pt-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl text-left transition-all border ${
                      theme === opt.id
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                        : "bg-[#1a1d2e]/50 border-white/5 text-slate-300 hover:bg-[#1a1d2e] hover:border-white/10"
                    }`}
                  >
                    <opt.icon className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500">{opt.desc}</div>
                    </div>
                    {theme === opt.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div className="bg-[#0f111a]/70 border border-white/5 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Account</h2>

              <div className="bg-[#1a1d2e]/50 border border-white/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Authentication Provider</h3>
                <p className="text-xs text-slate-500">You are signed in via OAuth (Google or GitHub).</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h3 className="text-sm font-semibold text-rose-400 mb-3">Danger Zone</h3>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-5 py-3 rounded-xl text-sm font-semibold transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
