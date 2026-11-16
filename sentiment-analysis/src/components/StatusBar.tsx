import { useModelStatus, type ModelStatus } from "../hooks/useModelStatus";
import { cn } from "../lib/utils";

const CONFIG: Record<ModelStatus, { label: string; dot: string; pulse: boolean }> = {
  checking: { label: "Checking model status", dot: "bg-amber-400", pulse: true },
  active: { label: "Model active", dot: "bg-emerald-500", pulse: true },
  inactive: {
    label: "Model inactive. The server may be starting up, and this page rechecks automatically.",
    dot: "bg-red-500",
    pulse: false,
  },
};

export default function StatusBar() {
  const status = useModelStatus();
  const { label, dot, pulse } = CONFIG[status];

  return (
    <div className="border-b border-stone-200 bg-white" role="status" aria-live="polite">
      <div className="mx-auto flex h-9 max-w-3xl items-center gap-2 px-6 text-xs text-stone-600">
        <span className="relative flex size-2">
          {pulse && (
            <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", dot)} />
          )}
          <span className={cn("relative inline-flex size-2 rounded-full", dot)} />
        </span>
        <span className="truncate">{label}</span>
      </div>
    </div>
  );
}
