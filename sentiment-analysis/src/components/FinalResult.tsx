import { motion } from "framer-motion";
import type { Prediction } from "../lib/api";
import { EMOTIONS } from "../lib/emotions";

export default function FinalResult({ result }: { result: Prediction }) {
  const emotion = EMOTIONS[result.predicted_emotion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      className="mt-4 flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <div className="flex items-center gap-5">
        <span
          className="grid size-16 shrink-0 place-items-center rounded-2xl text-4xl"
          style={{ backgroundColor: emotion.color + "33" }}
          aria-hidden
        >
          {emotion.emoji}
        </span>
        <div>
          <p className="text-sm text-slate-500">Final result</p>
          <p className="font-serif text-5xl leading-none tracking-tight">{emotion.label}</p>
        </div>
      </div>

      <div className="sm:max-w-sm sm:text-right">
        <p className="text-sm text-slate-500">
          <span className="text-2xl font-medium tabular-nums text-slate-900">
            {(result.confidence * 100).toFixed(1)}%
          </span>{" "}
          confidence
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">“{result.text}”</p>
      </div>
    </motion.div>
  );
}
