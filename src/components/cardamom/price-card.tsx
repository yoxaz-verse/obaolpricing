type PriceCardProps = {
  label: string;
  value: number | null;
  accent?: boolean;
};

export function PriceCard({ label, value, accent = false }: PriceCardProps) {
  return (
    <div
      className={[
        "rounded-3xl border px-5 py-5 shadow-xl md:px-6 md:py-6",
        accent
          ? "border-[#b88743] bg-gradient-to-r from-[#1e1910] via-[#17140d] to-[#15130f] shadow-[0_10px_40px_rgba(195,138,58,0.12)]"
          : "border-[#1A261E] bg-[#0E1511]",
      ].join(" ")}
    >
      <p className={`text-xs font-semibold tracking-[0.14em] uppercase truncate ${accent ? "text-[#d8ab68]" : "text-slate-500"}`}>{label}</p>
      <p className={`mt-2 truncate ${accent ? "text-4xl font-extrabold text-[#efc177] md:text-5xl" : "text-xl font-bold text-slate-200"}`}>
        {value === null ? "--" : `₹${Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
      </p>
      {accent ? <p className="mt-2 text-xs font-medium text-slate-400">Primary benchmark from latest auction update</p> : null}
    </div>
  );
}
