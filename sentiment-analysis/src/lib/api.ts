const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export type Emotion = "sadness" | "joy" | "love" | "anger" | "fear" | "surprise";

export interface Prediction {
  text: string;
  predicted_emotion: Emotion;
  emoji: string;
  confidence: number;
  all_probabilities: Record<Emotion, number>;
}

export async function predictEmotion(text: string): Promise<Prediction> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.replace(/[\u2018\u2019]/g, "'") }),
    });
  } catch {
    throw new Error("Can't reach the model server. Check that it is running and try again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      typeof body?.detail === "string" ? body.detail : "The model couldn't process that text. Try again."
    );
  }
  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.model_loaded);
  } catch {
    return false;
  }
}
