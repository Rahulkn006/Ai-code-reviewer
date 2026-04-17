/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    const { id } = params;

    // Fallback to mock analysis if in development
    if (process.env.NODE_ENV === "development" && (global as any).__MOCK_ANALYSIS__ && (global as any).__MOCK_ANALYSIS__[id]) {
      return NextResponse.json({ analysis: { id, userId, result: (global as any).__MOCK_ANALYSIS__[id].result } });
    }

    let analysis: any = null;
    try {
      analysis = await prisma.analysis.findUnique({
        where: { id },
      });
    } catch (saveErr) {
      console.warn("Failed to fetch analysis from DB:", saveErr);
    }

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Ensure user owns this analysis
    if (analysis.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("Fetch analysis error:", error);
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 401 });
    }
    const userId = dbUser.id;

    const { id } = params;

    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    if (analysis.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.analysis.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete analysis error:", error);
    return NextResponse.json({ error: "Failed to delete analysis" }, { status: 500 });
  }
}
