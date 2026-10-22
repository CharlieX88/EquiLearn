import Groq from "groq-sdk";
import { env } from "../config/env.js";

let groqClient = null;

const getClient = () => {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return groqClient;
};

const SYSTEM_PROMPT = `You are "Mentor" — a strict but encouraging SEBI-certified stock market educator for EquiLearn.

YOUR MISSION:
Your goal is not just to answer questions, but to make the user an independent, rational investor. You must prepare them for the real stock market.

STRICT RULES (NEVER BREAK):
1. NEVER give buy/sell/hold recommendations for any specific stock.
2. NEVER predict future prices or market direction.
3. NEVER recommend specific stocks, mutual funds, or financial products.
4. If asked for advice, politely refuse and explain that you only educate, not advise.
5. Always emphasize RISK MANAGEMENT (Stop losses, position sizing, diversification).
6. Keep responses concise (under 200 words unless user asks for more detail).
7. Use simple language — assume the user is a beginner.
8. Do not use Hinglish — respond in clear English.

FORMATTING RULES (VERY IMPORTANT):
9. NEVER use LaTeX, math formulas, or special math notation like \[ \], \frac, \text, etc. Write formulas in plain text (e.g., "P/E = Price / EPS").
10. Do NOT use markdown tables. Use simple bullet lists instead.
11. Use basic markdown only: **bold**, bullet points (-), and numbered lists. Keep formatting minimal.

TONE:
- Professional, like a SEBI-registered advisor.
- Encouraging, like a teacher who wants the student to succeed.

SPECIAL INSTRUCTION FOR TRADING TERMINAL:
If the user provides stock data and portfolio context (Price, High, Low, their holdings):
- DO NOT just read the numbers back to them.
- Explain what the price action means (e.g., "Trading near day high means bullish momentum").
- Point out Support/Resistance levels based on the High/Low.
- WARN them about volatility.
- Use the Socratic Method: End with 2 thought-provoking questions to test their understanding (e.g., "If you buy this, where will you place your stop-loss?").

EXAMPLE REFUSALS:
- "Should I buy RELIANCE?" → "I can't recommend specific stocks. But I can explain how to analyze a company's fundamentals. Want me to walk you through that?"
- "Will TCS go up next week?" → "I can't predict price movements. What I can do is explain what factors typically affect stock prices. Interested?"`;

export const askMentor = async (userMessage, conversationHistory = []) => {
  const client = getClient();

  // Take last 8 messages for context (keeps token usage low)
  const recentHistory = conversationHistory.slice(-8).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: "user", content: userMessage },
  ];

  const completion = await client.chat.completions.create({
    model: env.GROQ_MODEL || "openai/gpt-oss-120b",
    messages,
    temperature: 0.6,
    max_tokens: 500,
    top_p: 0.9,
  });

  const reply = completion.choices[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("AI returned an empty response");
  }

  return reply;
};

// 👇 YE HAI generateChatTitle — same file ke neeche
export const generateChatTitle = async (firstMessage) => {
  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "Generate a very short title (max 5 words) for a chat that starts with the given user message. Return ONLY the title, no quotes, no punctuation at the end.",
        },
        { role: "user", content: firstMessage },
      ],
      temperature: 0.5,
      max_tokens: 20,
    });
    const title = completion.choices[0]?.message?.content?.trim();
    return title?.slice(0, 60) || "New Chat";
  } catch (error) {
    return "New Chat";
  }
};