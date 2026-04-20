type StatusPanelProps = {
  status: string | null;
  error: string | null;
  sourceRef: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  sourceUrl: string | null;
  slot1100: "success" | "failed" | "pending";
  slot1400: "success" | "failed" | "pending";
};

function formatDateTime(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

export function StatusPanel(props: StatusPanelProps) {
  const chipClass =
    props.status === "success"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      : props.status === "failed"
        ? "bg-red-500/20 text-red-300 border-red-500/40"
        : "bg-slate-600/20 text-slate-300 border-slate-500/40";

  const windowChipClass = (status: "success" | "failed" | "pending") => {
    if (status === "success") return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
    if (status === "failed") return "border-red-500/40 bg-red-500/15 text-red-300";
    return "border-slate-600 bg-slate-700/40 text-slate-300";
  };

  return (
    <div className="rounded-2xl border border-[#1A261E] bg-[#0E1511] p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981]">Sync Status</h3>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${chipClass}`}>
          {props.status ?? "no-run"}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${windowChipClass(props.slot1100)}`}>
          11:00 IST: {props.slot1100}
        </span>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${windowChipClass(props.slot1400)}`}>
          14:00 IST: {props.slot1400}
        </span>
      </div>
      <div className="space-y-3 text-sm text-slate-300">
        <p className="flex justify-between border-b border-[#1A261E] pb-2">
          <span className="text-[#10b981]">Started</span>
          <span className="font-medium text-slate-200">{formatDateTime(props.startedAt)}</span>
        </p>
        <p className="flex justify-between border-b border-[#1A261E] pb-2">
          <span className="text-[#10b981]">Finished</span>
          <span className="font-medium text-slate-200">{formatDateTime(props.finishedAt)}</span>
        </p>
        <p className="flex justify-between border-b border-[#1A261E] pb-2">
          <span className="text-[#10b981]">Source Ref</span>
          <span className="font-medium text-slate-200">{props.sourceRef ?? "-"}</span>
        </p>
        <p className="flex justify-between pt-1">
          <span className="text-[#10b981]">Source URL</span>
          {props.sourceUrl ? (
            <a href={props.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-[#c38a3a] hover:text-[#e0a656] hover:underline underline-offset-2 transition-colors">
              Open page
            </a>
          ) : (
            <span className="font-medium text-slate-500">-</span>
          )}
        </p>
        {props.error ? <p className="mt-4 rounded-md bg-red-500/10 p-3 text-xs font-medium text-red-400 border border-red-500/20">Error: {props.error}</p> : null}
      </div>
    </div>
  );
}
