"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, History, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "New Analysis", href: "/", icon: PlusCircle },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="w-64 bg-card border-r border-border hidden md:flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <span>AI Code</span>
          <span className="text-foreground">Reviewer</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.name} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} AI Code Reviewer
        </p>
      </div>
    </div>
  );
}
