import { useEffect, useState } from "react";
import { checkHealth } from "../lib/api";

export type ModelStatus = "checking" | "active" | "inactive";

export function useModelStatus(intervalMs = 20_000): ModelStatus {
  const [status, setStatus] = useState<ModelStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const ok = await checkHealth();
      if (!cancelled) setStatus(ok ? "active" : "inactive");
    };
    run();
    const id = setInterval(run, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return status;
}
