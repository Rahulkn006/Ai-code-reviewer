/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeCode } from "@/lib/ai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
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

    const { code, type } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code content is missing" }, { status: 400 });
    }

    const aiResponse = await analyzeCode(code);
    const { result, provider } = aiResponse;

    let savedAnalysisId = `mock-id-${Date.now()}`;
    
    // Save to Database (fallback gracefully)
    try {
      const savedAnalysis = await prisma.analysis.create({
        data: {
          userId: userId,
          input: code.length > 50000 ? code.slice(0, 50000) + "... [TRUNCATED]" : code,
          result: result as any,
        }
      });
      savedAnalysisId = savedAnalysis.id;
    } catch (saveErr) {
      console.warn("Failed to save analysis to DB (using mock ID):", saveErr);
      
      // If we fall back, we can just save it to global to allow the next route to fetch it.
      (global as any).__MOCK_ANALYSIS__ = (global as any).__MOCK_ANALYSIS__ || {};
      (global as any).__MOCK_ANALYSIS__[savedAnalysisId] = { result };
    }

    return NextResponse.json({ result, provider, id: savedAnalysisId });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed. Please try again later." }, { status: 500 });
  }
}
