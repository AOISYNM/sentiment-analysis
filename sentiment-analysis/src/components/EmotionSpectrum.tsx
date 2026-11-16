import { motion } from "framer-motion";
import type { Emotion } from "../lib/api";
import { EMOTION_ORDER, EMOTIONS } from "../lib/emotions";
import { cn } from "../lib/utils";

export default function EmotionSpectrum({ active }: { active?: Emotion }) {
  return (
    <ul className="grid grid-cols-3 gap-1 rounded-2xl bg-stone-100 p-1 sm:grid-cols-6">
      {EMOTION_ORDER.map((key) => {
        const emotion = EMOTIONS[key];
        const on = key === active;
        return (
          <li
            key={key}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-sm text-stone-600 transition-opacity",
              active && !on && "opacity-40"
            )}
          >
            {on && (
              <motion.span
                layoutId="spectrum-active"
                className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-stone-300"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative text-2xl" aria-hidden>
              {emotion.emoji}
            </span>
            <span className="relative">{emotion.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
