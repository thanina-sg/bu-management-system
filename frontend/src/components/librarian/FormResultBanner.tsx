import type { FormResult } from "./types";

export function FormResultBanner({ result }: { result: FormResult }) {
  if (!result) return null;

  if (result.type === "error") {
    return (
      <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {result.message}
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-[10px]">&#x2713;</span>
        {result.title}
      </div>
      <div className="mt-3 space-y-1.5">
        {Object.entries(result.details).map(([key, value]) => (
          <div key={key} className="flex gap-2 text-xs">
            <span className="w-28 shrink-0 font-medium text-ink-500">{key}:</span>
            <span className={key === "Retard" ? "font-semibold text-rose-700" : "text-ink-900"}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
