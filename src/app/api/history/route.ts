/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId = "local-dev-id";
    if (process.env.NODE_ENV !== "development") {
      try {
        const dbUser = await prisma.user.findUnique({ where: { email: userEmail! } });
        if (!dbUser) {
          return NextResponse.json({ error: "User not found in database" }, { status: 401 });
        }
        userId = dbUser.id;
      } catch (err) {
        console.warn("DB connection failed for user lookup:", err);
      }
    }

    let history: any[] = [];

    // Fallback to mock analysis if in development
    if (process.env.NODE_ENV === "development" && (global as any).__MOCK_ANALYSIS__) {
      const mockAnalyses = Object.entries((global as any).__MOCK_ANALYSIS__).map(([id, data]: [string, any]) => ({
        id,
        createdAt: new Date().toISOString(), // Mock timestamp since we only saved result previously
        result: data.result
      }));
      history = [...mockAnalyses];
    }

    try {
      const dbHistory = await prisma.analysis.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          result: true,
        }
      });
      if (dbHistory && dbHistory.length > 0) {
        history = [...history, ...dbHistory];
      }
    } catch (saveErr) {
      console.warn("Failed to fetch history from DB:", saveErr);
    }

    return NextResponse.json({ history });
  } catch (error: any) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
