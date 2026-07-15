import { clsx } from "clsx";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "real" | "simulated" | "authorized" | "neutral";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
        tone === "real" && "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
        tone === "simulated" && "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
        tone === "authorized" && "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
        tone === "neutral" && "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      )}
    >
      {children}
    </span>
  );
}
