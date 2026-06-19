import type { IncomingMessage, ServerResponse } from "node:http";
import Groq from "groq-sdk";

/**
 * Serverless paraphrasing endpoint.
 *
 * The Groq API key lives ONLY on the server (process.env.GROQ_API_KEY) and is
 * never shipped to the browser. This handler is written against the plain
 * Node request/response types so the identical code runs both as a Vercel
 * Serverless Function and inside the local Vite dev middleware.
 */

const MODEL = "llama-3.3-70b-versatile";

// Per-mode steering instructions appended to the system prompt.
const MODES: Record<string, string> = {
  standard: "Keep a natural, balanced tone close to the original.",
  fluent: "Make it smooth, polished and easy to read.",
  formal: "Use a professional, formal tone suitable for business writing.",
  academic: "Use a precise, scholarly tone suitable for academic writing.",
  simple: "Use plain, simple language that is easy for anyone to understand.",
  creative: "Use expressive, varied and engaging language while keeping the meaning.",
};

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  // On Vercel the body may already be parsed; fall back to reading the stream
  // (which is what happens under the Vite dev middleware).
  const maybeBody = (req as unknown as { body?: unknown }).body;
  if (maybeBody && typeof maybeBody === "object") return maybeBody as Record<string, unknown>;
  if (typeof maybeBody === "string" && maybeBody.length) return JSON.parse(maybeBody);

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    return send(res, 405, { error: "Method not allowed." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return send(res, 500, {
      error: "Server is not configured. Missing GROQ_API_KEY environment variable.",
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await readBody(req);
  } catch {
    return send(res, 400, { error: "Invalid request body." });
  }

  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const modeKey = typeof payload.mode === "string" ? payload.mode : "standard";
  const modeInstruction = MODES[modeKey] ?? MODES.standard;

  if (!text) {
    return send(res, 400, { error: "Please provide some text to paraphrase." });
  }
  if (text.length > 12000) {
    return send(res, 413, { error: "Text is too long. Please keep it under 12,000 characters." });
  }

  const systemPrompt = [
    "You are a paraphrasing engine.",
    "Rewrite the user's text so it keeps the exact same meaning but uses different wording and sentence structure.",
    "Preserve the original language, facts, names, numbers, and formatting (line breaks, lists).",
    modeInstruction,
    "Return ONLY the rewritten text — no preamble, no explanations, no quotation marks, no commentary.",
  ].join(" ");

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.8,
      top_p: 1,
      max_completion_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!result) {
      return send(res, 502, { error: "The model returned an empty response. Please try again." });
    }
    return send(res, 200, { text: result });
  } catch (error) {
    console.error("Groq request failed:", error);
    return send(res, 502, { error: "Failed to paraphrase the text. Please try again." });
  }
}
