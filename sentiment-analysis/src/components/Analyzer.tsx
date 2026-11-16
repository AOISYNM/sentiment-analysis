import { useState, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { predictEmotion, type Prediction } from "../lib/api";
import { MAX_LENGTH, textSchema } from "../lib/validation";
import RadarChart from "./RadarChart";
import Results from "./Results";
import FinalResult from "./FinalResult";
import { cn } from "../lib/utils";

const EXAMPLES = [
  "I can't believe I finally got the job!",
  "I miss how things used to be.",
  "That noise outside the window scared me.",
  "You have no right to talk to me like that.",
];

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze(value: string = text) {
    const parsed = textSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      setResult(await predictEmotion(parsed.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") analyze();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition focus-within:ring-2 focus-within:ring-teal-600/40">
          <label htmlFor="text" className="sr-only">
            Sentence to analyze
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={7}
            placeholder="Type or paste a sentence"
            className="w-full flex-1 resize-none bg-transparent text-xl leading-relaxed outline-none placeholder:text-slate-400"
          />
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs tabular-nums text-slate-400">
              {text.length}/{MAX_LENGTH}
            </span>
            <button
              onClick={() => analyze()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Analyzing" : "Analyze text"}
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setText(example);
                  analyze(example);
                }}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 shadow-lg">
          <div className={cn("transition-opacity", loading && "opacity-50")}>
            <RadarChart result={result} />
          </div>
          <Results result={result} />
        </div>
      </div>
      {result && <FinalResult result={result} />}
    </section>
  );
}
