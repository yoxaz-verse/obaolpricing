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
    <div className="rounded-3xl border border-[#1f3027] bg-gradient-to-b from-[#0f1b15] to-[#0b1410] p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#64d3a1]">Sync Status</h3>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${chipClass}`}>
          {props.status ?? "no-run"}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${windowChipClass(props.slot1100)}`}>
          12:15 IST: {props.slot1100}
        </span>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${windowChipClass(props.slot1400)}`}>
          14:00 IST: {props.slot1400}
        </span>
      </div>
      <div className="space-y-3 text-sm text-slate-300">
        <p className="flex justify-between border-b border-[#253b30] pb-2">
          <span className="text-[#64d3a1]">Last Updated</span>
          <span className="font-medium text-slate-200">{formatDateTime(props.finishedAt) === "-" ? formatDateTime(props.startedAt) : formatDateTime(props.finishedAt)}</span>
        </p>
        <p className="flex justify-between pt-1">
          <span className="text-[#64d3a1]">AP Data Source</span>
          {props.sourceUrl ? (
            <a href={props.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-[#c38a3a] hover:text-[#e0a656] hover:underline underline-offset-2 transition-colors">
              Spices Board India
            </a>
          ) : (
            <span className="font-medium text-slate-500">-</span>
          )}
        </p>
        
        {props.error ? <p className="mt-4 rounded-md bg-red-500/10 p-3 text-xs font-medium text-red-400 border border-red-500/20">Error: {props.error}</p> : null}

        <div className="mt-6 rounded-2xl border border-[#263d31] bg-[#101a15] p-4 text-center">
          <p className="mb-3 text-xs text-slate-400">
            Connect via WhatsApp for any enquiries or purchase related process
          </p>
          <a
            href="https://wa.me/919019351483?text=Hi%2C%20I%20am%20enquiring%20about%20the%20cardamom%20through%20the%20cardamom.obaol.com%20website%20and%20would%20like%20to%20get%20a%20quote%20of%20(name%20your%20quality)%3A"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Connect via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
