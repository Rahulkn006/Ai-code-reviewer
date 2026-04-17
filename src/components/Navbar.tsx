"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { GitBranch, LogOut, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-primary">AI Reviewer</h1>
      </div>
      
      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <a href="https://github.com" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <GitBranch className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </a>

        {status === "loading" ? (
          <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={session.user.image!} alt={session.user.name || "User"} />
              <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => signIn()} variant="secondary" className="gap-2">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
