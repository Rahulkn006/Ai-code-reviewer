const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log("Gemini Success! Received response successfully.");
  } catch (e) {
    console.error("Gemini Error:", e.message);
  }
}

async function testGroq() {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: "hello" }],
      }),
    });
    const data = await res.json();
    if(data.error) {
       console.error("Groq JSON Error:", data.error.message);
    } else {
       console.log("Groq Success! Received response successfully.");
    }
  } catch (e) {
    console.error("Groq Network Error:", e.message);
  }
}

testGemini();
testGroq();
