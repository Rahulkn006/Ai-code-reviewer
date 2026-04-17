import { NextRequest, NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { code } = await req.json()

  const prompt = `Review this code:\n${code}`

  try {
    const result = await generateAIResponse(prompt)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (user) {
      await prisma.analysis.create({
        data: {
          userId: user.id,
          input: code,
          result: result || "No response received",
        },
      })
    }

    return NextResponse.json({ result: result || "Review failed" })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("API REVIEW ERROR:", error)
    return NextResponse.json({ 
      error: errorMessage || "Unknown server error during analysis/storage." 
    }, { status: 500 })
  }
}
