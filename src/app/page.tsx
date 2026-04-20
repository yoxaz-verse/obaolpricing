import Link from "next/link";
import Image from "next/image";
import { PriceCard } from "@/components/cardamom/price-card";
import { StatusPanel } from "@/components/cardamom/status-panel";
import { TrendChart } from "@/components/cardamom/trend-chart";
import { getHistory, getLatestRunForToday, getLatestWithPrevious, getTodayWindowStatuses } from "@/lib/history";
import { getTrendDirection } from "@/lib/pricing";
import { getMarketFactor, getVariantDefinitions, getVariantRupeeAddon } from "@/lib/settings";
import { computeVariantValue, getActiveVariants } from "@/lib/variants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: {
    range?: string;
    page?: string;
    pageSize?: string;
  };
};

type HistoryRow = {
  id: string;
  date: Date;
  auctionAvg: number;
};

const RANGE_TO_DAYS: Record<string, number> = {
  "1w": 7,
  "2w": 14,
  "30d": 30,
  "6m": 180,
  "1y": 365,
  "3y": 1095,
  "5y": 1825,
};

const RANGE_LABEL: Record<string, string> = {
  "1w": "1-Week Auction Avg Trend",
  "2w": "2-Week Auction Avg Trend",
  "30d": "30-Day Auction Avg Trend",
  "6m": "6-Month Auction Avg Trend",
  "1y": "1-Year Auction Avg Trend",
  "3y": "3-Year Auction Avg Trend",
  "5y": "5-Year Auction Avg Trend",
};

function normalizeRange(value: string | undefined) {
  if (!value) return "1y";
  if (["1w", "2w", "30d", "6m", "1y", "3y", "5y"].includes(value)) return value;
  return "1y";
}

function normalizePage(value: string | undefined, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(Math.floor(parsed), 1);
}

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(value);
}


export default async function HomePage({ searchParams }: HomePageProps) {
  const isDbConfigured = Boolean(process.env.DATABASE_URL);
  const range = normalizeRange(searchParams?.range);
  const tablePage = normalizePage(searchParams?.page, 1);
  const tablePageSize = Math.min(Math.max(normalizePage(searchParams?.pageSize, 15), 5), 50);
  const days = RANGE_TO_DAYS[range];

  const [{ latest, previous }, history, run, windows, marketFactor, variantRupeeAddon, allVariants] = await Promise.all([
    getLatestWithPrevious(),
    getHistory(days),
    getLatestRunForToday(),
    getTodayWindowStatuses(),
    getMarketFactor(),
    getVariantRupeeAddon(),
    getVariantDefinitions(),
  ]);

  const variants = getActiveVariants(allVariants);
  const trend = latest ? getTrendDirection(latest.auctionAvg, previous?.auctionAvg ?? null) : "flat";
  const trendText = trend === "up" ? "↑ Up" : trend === "down" ? "↓ Down" : "→ Flat";
  const hasHistory = history.length > 0;
  const orderedDesc = history.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
  const totalPages = Math.max(Math.ceil(orderedDesc.length / tablePageSize), 1);
  const safeTablePage = Math.min(tablePage, totalPages);
  const tableStart = (safeTablePage - 1) * tablePageSize;
  const tableRows = orderedDesc.slice(tableStart, tableStart + tablePageSize);
  const tableQuery = `range=${range}&pageSize=${tablePageSize}`;

  return (
    <main className="min-h-screen bg-[#090D0A] text-slate-100 font-sans selection:bg-[#c38a3a]/30">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {!isDbConfigured ? (
          <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            `DATABASE_URL` is missing. Add it in your `.env` file and restart the server.
          </div>
        ) : null}

        <header className="mb-8 rounded-2xl border border-[#1A261E] bg-[#0E1511] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c38a3a]">Cardamom Panel</p>
            <Image src="/Obaol.png" alt="OBAOL Logo" width={160} height={40} className="h-8 w-auto object-contain opacity-90" priority />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">Market Intelligence</h1>
          <p className="mt-2 text-slate-400">
            Today: <span className="text-slate-200">{formatDate(latest?.date ?? null)}</span> <span className="opacity-50 mx-2">|</span> Trend: <span className="text-[#c38a3a] font-medium">{trendText}</span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(["1w", "2w", "30d", "6m", "1y", "3y", "5y"] as const).map((key) => (
              <Link
                key={key}
                href={key === "1y" ? "/" : `/?range=${key}`}
                className={[
                  "rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                  range === key
                    ? "border-[#c38a3a] bg-[#c38a3a]/10 text-[#c38a3a] shadow-[0_0_10px_rgba(195,138,58,0.15)]"
                    : "border-[#1A261E] bg-[#111A15] text-slate-400 hover:border-[#2C4033] hover:text-slate-200",
                ].join(" ")}
              >
                {key}
              </Link>
            ))}
          </div>
        </header>

        <section className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 overflow-hidden">
          <PriceCard label="Auction Avg (AP)" value={latest?.auctionAvg ?? null} accent />
          {variants.map((variant) => (
            <PriceCard
              key={variant.id}
              label={`${variant.label} (Live)`}
              value={latest ? computeVariantValue(latest.auctionAvg, marketFactor, variant.multiplier, variantRupeeAddon) : null}
            />
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <TrendChart
            title={RANGE_LABEL[range]}
            series={[
              {
                id: "auctionAvg",
                label: "Auction Avg",
                color: "#c38a3a",
                points: (history as HistoryRow[]).map((item) => ({
                  date: new Intl.DateTimeFormat("en-IN", {
                    month: "short",
                    day: "numeric",
                    timeZone: "Asia/Kolkata",
                  }).format(item.date),
                  value: item.auctionAvg,
                  tooltipDate: new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeZone: "Asia/Kolkata",
                  }).format(item.date),
                })),
              },
            ]}
          />

          <StatusPanel
            status={run?.status ?? null}
            error={run?.error ?? null}
            sourceRef={run?.videoId ?? null}
            startedAt={run?.startedAt ?? null}
            finishedAt={run?.finishedAt ?? null}
            sourceUrl={latest?.videoUrl ?? null}
            slot1100={windows.slot1100}
            slot1400={windows.slot1400}
          />
        </section>

        {!hasHistory ? (
          <section className="mt-6 rounded-xl border border-[#1A261E] bg-[#0E1511] p-5 text-sm text-slate-400">
            No rate history yet. Use the <Link href="/admin" className="text-[#c38a3a] hover:underline font-medium">Admin Control Center</Link> to run archive import (2015+) and then daily sync.
          </section>
        ) : null}

        <section className="mt-6 rounded-2xl border border-[#1A261E] bg-[#0E1511] p-5 shadow-xl">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Recent AP Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 border-b border-[#1A261E]">
                <tr>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Auction Avg</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.id} className="border-t border-[#1A261E]/50 text-slate-200 hover:bg-[#151D18] transition-colors">
                    <td className="py-3">{formatDate(row.date)}</td>
                    <td className="py-3 text-right font-medium text-[#c38a3a]">₹{Math.round(row.auctionAvg).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Page {safeTablePage} of {totalPages} <span className="mx-2 opacity-50">|</span> {orderedDesc.length} records</span>
            <div className="flex gap-2">
              <Link
                href={safeTablePage <= 1 ? `/?${tableQuery}&page=1` : `/?${tableQuery}&page=${safeTablePage - 1}`}
                className={`rounded border border-[#1A261E] bg-[#111A15] px-3 py-1.5 transition-colors ${safeTablePage <= 1 ? "pointer-events-none opacity-40" : "hover:border-[#2C4033] hover:text-slate-300"}`}
              >
                Prev
              </Link>
              <Link
                href={`/?${tableQuery}&page=${Math.min(safeTablePage + 1, totalPages)}`}
                className={`rounded border border-[#1A261E] bg-[#111A15] px-3 py-1.5 transition-colors ${safeTablePage >= totalPages ? "pointer-events-none opacity-40" : "hover:border-[#2C4033] hover:text-slate-300"}`}
              >
                Next
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
