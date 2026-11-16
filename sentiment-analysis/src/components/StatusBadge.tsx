import { useModelStatus, type ModelStatus } from "../hooks/useModelStatus";
import { cn } from "../lib/utils";

const CONFIG: Record<ModelStatus, { short: string; long: string; dot: string; pulse: boolean }> = {
  checking: { short: "Checking", long: "Checking model", dot: "bg-amber-400", pulse: true },
  active: { short: "Active", long: "Model active", dot: "bg-emerald-500", pulse: true },
  inactive: { short: "Inactive", long: "Model inactive", dot: "bg-red-500", pulse: false },
};

export default function StatusBadge() {
  const status = useModelStatus();
  const { short, long, dot, pulse } = CONFIG[status];

  return (
    <span
      role="status"
      title={status === "inactive" ? "The server may be starting up. This rechecks automatically." : undefined}
      className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/5"
    >
      <span className="relative flex size-2">
        {pulse && <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", dot)} />}
        <span className={cn("relative inline-flex size-2 rounded-full", dot)} />
      </span>
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{long}</span>
    </span>
  );
}
