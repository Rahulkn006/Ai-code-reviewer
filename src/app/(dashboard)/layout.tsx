import { ReactNode } from "react"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-slate-200 font-sans selection:bg-indigo-500/30">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
