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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide",
        tone === "real" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
        tone === "simulated" && "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
        tone === "authorized" && "bg-sky-50 text-sky-700 ring-1 ring-sky-200/80",
        tone === "neutral" && "bg-slate-50 text-slate-600 ring-1 ring-slate-200/80",
      )}
    >
      {tone === "real" && <span className="size-1.5 rounded-full bg-emerald-500" />}
      {tone === "authorized" && <span className="size-1.5 rounded-full bg-sky-500" />}
      {children}
    </span>
  );
}
