"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, PlusCircle, History, Settings, LogOut, Loader2 } from "lucide-react"

export function DashboardNavbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Review", href: "/new-review", icon: PlusCircle },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-mono font-bold text-sm leading-none">{'< >'}</span>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Review<span className="text-indigo-400">IQ</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* PROFILE / LOGOUT */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
             <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : session ? (
             <div className="flex items-center gap-4">
               <span className="text-sm font-medium text-slate-300 hidden sm:block">
                 {session.user?.name?.split(" ")[0]}
               </span>
               <button 
                 onClick={() => signOut({ callbackUrl: '/' })}
                 className="flex items-center gap-2 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition"
               >
                 <LogOut className="w-4 h-4" />
                 <span className="hidden sm:block">Logout</span>
               </button>
             </div>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
