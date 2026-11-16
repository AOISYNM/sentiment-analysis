import { motion } from "framer-motion";
import type { Prediction } from "../lib/api";
import { EMOTION_ORDER, EMOTIONS } from "../lib/emotions";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function Results({ result }: { result: Prediction | null }) {
  if (!result) {
    return <p className="mt-6 text-center text-sm text-slate-400">Analyze a sentence to see its emotion profile.</p>;
  }

  const rows = EMOTION_ORDER.map((key) => ({ key, value: result.all_probabilities[key] ?? 0 })).sort(
    (a, b) => b.value - a.value
  );

  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm" aria-label="Probability for each emotion">
      {rows.map(({ key, value }) => (
        <motion.li key={key} layout>
          <div className="flex justify-between text-slate-300">
            <span>{EMOTIONS[key].label}</span>
            <span className="tabular-nums text-slate-400">{pct(value)}</span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: EMOTIONS[key].color }}
              initial={{ width: 0 }}
              animate={{ width: `${value * 100}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
