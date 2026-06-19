export interface ParaphraseMode {
  key: string;
  label: string;
}

/** Writing styles offered in the UI. Keys must match the server (api/paraphrase.ts). */
export const PARAPHRASE_MODES: ParaphraseMode[] = [
  { key: "standard", label: "Standard" },
  { key: "fluent", label: "Fluent" },
  { key: "formal", label: "Formal" },
  { key: "academic", label: "Academic" },
  { key: "simple", label: "Simple" },
  { key: "creative", label: "Creative" },
];

/**
 * Sends text to the serverless endpoint and returns the paraphrased result.
 * The Groq API key never reaches the browser — it lives on the server only.
 */
export async function paraphraseText(input: string, mode = "standard"): Promise<string> {
  const response = await fetch("/api/paraphrase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input, mode }),
  });

  let data: { text?: string; error?: string } = {};
  try {
    data = await response.json();
  } catch {
    throw new Error("Unexpected response from the server. Please try again.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to paraphrase text. Please try again.");
  }

  return (data.text ?? "").trim();
}
