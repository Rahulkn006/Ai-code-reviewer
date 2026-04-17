import { GoogleGenerativeAI } from "@google/generative-ai"

// Define a structured system prompt
const SYSTEM_PROMPT = `You are an elite senior software engineer and code reviewer.
Review the provided code and return EXACTLY a JSON string with NO markdown formatting, NO backticks, and NO extra text.
The JSON must adhere to the following structure:
{
  "score": <number 1-10>,
  "summary": "<string, concise overall review>",
  "bugs": [
    { "type": "<string>", "severity": "<Critical|Warning|Info>", "message": "<string>" }
  ],
  "suggestions": ["<string>", "<string>"],
  "refactored_code": "<string, the fully refactored and improved code snippet>",
  "documentation": "<string, auto-generated documentation>",
  "metrics": {
    "complexity": "<string, e.g. Low/Medium/High>",
    "readability": "<string, e.g. Good/Needs Improvement>",
    "maintainability": "<string>"
  }
}

Ensure the output is specifically valid JSON.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const gemini = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json"
  }
});

function parseJSONFromText(text: string) {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI output as JSON: " + text.substring(0, 50));
  }
}

async function callGroq(code: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Review this code:\n\n${code}` },
      ],
    }),
  });

  if (!res.ok) throw new Error("Groq failed");
  const data = await res.json();
  const text = data.choices[0].message.content;
  return parseJSONFromText(text);
}

async function callGemini(code: string) {
  const prompt = `${SYSTEM_PROMPT}\n\nReview this code:\n\n${code}`;
  const res = await gemini.generateContent(prompt);
  const text = res.response.text();
  return parseJSONFromText(text);
}

export async function generateAIResponse(prompt: string) {
  try {
    return await callGroq(prompt);
  } catch (error) {
    console.error("Groq failed, falling back to Gemini:", error);
    return await callGemini(prompt);
  }
}

export async function analyzeCode(code: string) {
  try {
    const result = await callGroq(code);
    return { result, provider: "groq" };
  } catch (error) {
    console.error("Groq analysis failed, falling back to Gemini:", error);
    const result = await callGemini(code);
    return { result, provider: "gemini" };
  }
}
