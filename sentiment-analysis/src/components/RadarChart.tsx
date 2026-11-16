import { motion } from "framer-motion";
import type { Prediction } from "../lib/api";
import { EMOTION_ORDER, EMOTIONS } from "../lib/emotions";

const SIZE = 340;
const C = SIZE / 2;
const R = 105;
const N = EMOTION_ORDER.length;

const point = (i: number, r: number): [number, number] => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const ring = (scale: number) => EMOTION_ORDER.map((_, i) => point(i, R * scale).join(",")).join(" ");
// Small floor so the shape never collapses to a point. Exact values are shown as percentages.
const shape = (values: number[]) =>
  "M" +
  values.map((v, i) => point(i, R * (0.04 + 0.96 * v)).map((n) => n.toFixed(1)).join(" ")).join(" L") +
  " Z";

export default function RadarChart({ result }: { result: Prediction | null }) {
  const values = EMOTION_ORDER.map((k) => result?.all_probabilities[k] ?? 0);
  const top = result?.predicted_emotion;
  const color = top ? EMOTIONS[top].color : "#64748B";

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-sm" role="img" aria-label="Emotion profile">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon key={s} points={ring(s)} fill="none" stroke="rgba(255,255,255,0.1)" />
      ))}
      {EMOTION_ORDER.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />;
      })}
      <motion.path
        initial={false}
        animate={{ d: shape(values), fill: color + "40", stroke: color }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {EMOTION_ORDER.map((key, i) => {
        const [x, y] = point(i, R + 34);
        const on = key === top;
        return (
          <g key={key} opacity={top && !on ? 0.35 : 1} style={{ transition: "opacity 0.3s" }}>
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={on ? 28 : 22}>
              {EMOTIONS[key].emoji}
            </text>
            <text x={x} y={y + (on ? 25 : 21)} textAnchor="middle" fontSize="11" fill="#94A3B8">
              {EMOTIONS[key].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
