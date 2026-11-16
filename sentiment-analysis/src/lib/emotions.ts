import type { Emotion } from "./api";

export const EMOTION_ORDER: Emotion[] = ["joy", "love", "surprise", "fear", "anger", "sadness"];

export const EMOTIONS: Record<Emotion, { label: string; emoji: string; color: string }> = {
  joy: { label: "Joy", emoji: "😄", color: "#FBBF24" },
  love: { label: "Love", emoji: "❤️", color: "#FB7185" },
  surprise: { label: "Surprise", emoji: "😲", color: "#34D399" },
  fear: { label: "Fear", emoji: "😨", color: "#A78BFA" },
  anger: { label: "Anger", emoji: "😠", color: "#F87171" },
  sadness: { label: "Sadness", emoji: "😢", color: "#38BDF8" },
};
