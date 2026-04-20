type PriceCardProps = {
  label: string;
  value: number | null;
  accent?: boolean;
};

export function PriceCard({ label, value, accent = false }: PriceCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 shadow-xl",
        accent
          ? "border-[#c38a3a] bg-[#c38a3a]/10 shadow-none"
          : "border-[#1A261E] bg-[#0E1511]",
      ].join(" ")}
    >
      <p className={`text-[11px] font-semibold tracking-wide uppercase truncate ${accent ? "text-[#c38a3a]" : "text-slate-500"}`}>{label}</p>
      <p className={`mt-1.5 truncate ${accent ? "text-2xl font-extrabold text-[#c38a3a]" : "text-xl font-bold text-slate-200"}`}>
        {value === null ? "--" : `₹${Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
      </p>
    </div>
  );
}
