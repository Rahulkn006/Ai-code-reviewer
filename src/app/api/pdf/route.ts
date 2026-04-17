import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { extractText } from "unpdf";

// Use dynamic import for pdf-parse to avoid require() lint error if possible, 
// or keep it but handle the types/imports properly.
// Since pdf-parse doesn't have good TS types and uses require, 
// we can keep it but suppress the error correctly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let textStr = "";

    try {
      const { text } = await extractText(new Uint8Array(arrayBuffer));
      textStr = Array.isArray(text) ? text.join('\n') : text;
    } catch (unpdfError) {
      console.warn("unpdf failed, trying pdf-parse fallback", unpdfError);
      try {
        const data = await pdfParse(buffer);
        textStr = data.text;
      } catch (err) {
        console.error("pdf-parse failed:", err);
        throw new Error("Both PDF engines failed to extract text.");
      }
    }

    if (!textStr || textStr.trim().length === 0) {
      return NextResponse.json({ error: "No text could be extracted from PDF" }, { status: 400 });
    }

    return NextResponse.json({ code: textStr.trim() });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("PDF Parsing error:", error);
    return NextResponse.json({ error: errorMessage || "Failed to process PDF" }, { status: 500 });
  }
}
