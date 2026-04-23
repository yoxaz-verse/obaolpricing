"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type GradeMultipliers = {
  price6: number;
  price67: number;
  price7: number;
  price78: number;
  price8: number;
  price8Plus: number;
};

type WindowStatus = "success" | "failed" | "pending";

type VariantDefinition = {
  id: string;
  label: string;
  multiplier: number;
  active: boolean;
  order: number;
  highlight?: boolean;
};

type SettingsResponse = {
  marketFactor: number;
  variantRupeeAddon: number;
  gradeMultipliers: GradeMultipliers;
  sourceUrl: string;
  keywordRules: string[];
  variantDefinitions: VariantDefinition[];
};

type RunItem = {
  id: string;
  runType: string;
  runDate: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  error: string | null;
  videoId?: string | null;
};

type PagedRuns = {
  items: RunItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type JobProgress = {
  id: string;
  jobType: "sync_latest" | "archive_import";
  status: "queued" | "running" | "completed" | "failed";
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  message: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  progressPercent: number;
};

type JobUiState = {
  active: boolean;
  title: string;
  progress: JobProgress | null;
};

const CANONICAL_VARIANT_IDS = new Set(["price6", "price67", "price7", "price78", "price8", "price8Plus"]);

const defaultMultipliers: GradeMultipliers = {
  price6: 0.88,
  price67: 0.94,
  price7: 1,
  price78: 1.07,
  price8: 1.15,
  price8Plus: 1.22,
};

function badgeClass(status: WindowStatus) {
  if (status === "success") return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
  if (status === "failed") return "border-red-500/40 bg-red-500/15 text-red-300";
  return "border-emerald-900/60 bg-[#0d1611] text-emerald-500";
}

function formatProgress(progress: JobProgress | null) {
  if (!progress) return "Not started";
  return `${progress.processedItems}/${progress.totalItems} processed · ${progress.successCount} success · ${progress.errorCount} errors`;
}


export default function AdminPage() {
  const isProduction = process.env.NODE_ENV === "production";
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [syncJob, setSyncJob] = useState<JobUiState>({
    active: false,
    title: "Sync Latest",
    progress: null,
  });
  const [importJob, setImportJob] = useState<JobUiState>({
    active: false,
    title: "Import Archive (2015+)",
    progress: null,
  });

  const [settings, setSettings] = useState<SettingsResponse>({
    marketFactor: 1.02,
    variantRupeeAddon: 0,
    gradeMultipliers: defaultMultipliers,
    sourceUrl: "https://www.indianspices.com/marketing/price/domestic/daily-price-small.html",
    keywordRules: [],
    variantDefinitions: [
      { id: "price7", label: "7 Grade", multiplier: 1, active: true, order: 1, highlight: true },
      { id: "price78", label: "7 to 8", multiplier: 1.07, active: true, order: 2 },
      { id: "price8", label: "8 Grade", multiplier: 1.15, active: true, order: 3 },
      { id: "price8Plus", label: "8+ Grade", multiplier: 1.22, active: true, order: 4 },
      { id: "price6", label: "6 Grade", multiplier: 0.88, active: true, order: 5 },
      { id: "price67", label: "6 to 7", multiplier: 0.94, active: true, order: 6 },
    ],
  });

  const [windowStatus, setWindowStatus] = useState<{ slot1100: WindowStatus; slot1400: WindowStatus }>({
    slot1100: "pending",
    slot1400: "pending",
  });

  const [runs, setRuns] = useState<PagedRuns>({ items: [], total: 0, page: 1, pageSize: 25, totalPages: 1 });
  const [runsPage, setRunsPage] = useState(1);

  const [keywordInput, setKeywordInput] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualAuctionAvg, setManualAuctionAvg] = useState("");
  const [latestAuctionAvg, setLatestAuctionAvg] = useState<number | null>(null);
  const [settingsSaveStatus, setSettingsSaveStatus] = useState<{
    type: "idle" | "success" | "error";
    text?: string;
    at?: string;
  }>({ type: "idle" });

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

  useEffect(() => {
    if (!isProduction) return;
    const savedToken = window.localStorage.getItem("admin_api_token") ?? "";
    setToken(savedToken);
  }, [isProduction]);

  useEffect(() => {
    if (isProduction && !token) return;

    void loadSettings(token);
    void loadRuns(token, runsPage);
    void loadWindowStatus();
  }, [token, runsPage, isProduction]);

  async function loadSettings(activeToken: string) {
    const response = await fetch("/api/admin/settings", {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    });

    if (!response.ok) {
      setMessage("Failed to load settings. Check token.");
      return;
    }

    const data = (await response.json()) as SettingsResponse;
    const sortedVariants = (data.variantDefinitions ?? []).slice().sort((a, b) => a.order - b.order);
    setSettings({ ...data, variantDefinitions: sortedVariants });
    setKeywordInput((data.keywordRules ?? []).join(", "));
  }

  async function loadRuns(activeToken: string, page: number) {
    const response = await fetch(`/api/admin/runs?page=${page}&pageSize=25`, {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      setMessage("Failed to load sync runs.");
      return;
    }

    const data = (await response.json()) as PagedRuns;
    setRuns(data);
  }

  async function loadWindowStatus() {
    const response = await fetch("/api/latest-price", { cache: "no-store" });
    if (!response.ok) return;

    const data = (await response.json()) as {
      latest?: { auctionAvg?: number } | null;
      extractionStatus?: { dailyWindows?: { slot1100?: WindowStatus; slot1400?: WindowStatus } };
    };
    const latestAp = Number(data.latest?.auctionAvg);
    setLatestAuctionAvg(Number.isFinite(latestAp) ? latestAp : null);

    setWindowStatus({
      slot1100: data.extractionStatus?.dailyWindows?.slot1100 ?? "pending",
      slot1400: data.extractionStatus?.dailyWindows?.slot1400 ?? "pending",
    });
  }

  async function saveToken(event: FormEvent) {
    event.preventDefault();
    if (!isProduction) {
      setMessage("Token entry is not required in local development.");
      return;
    }

    window.localStorage.setItem("admin_api_token", token);
    setMessage("Admin token saved in browser storage.");
    await loadSettings(token);
    await loadRuns(token, runsPage);
  }

  async function runJobLoop(args: {
    startUrl: string;
    stepUrl: string;
    title: string;
    setJob: (state: JobUiState) => void;
    startBody?: Record<string, unknown>;
    batchSize?: number;
  }) {
    if (isProduction && !token) {
      setMessage("Enter admin token first.");
      return;
    }

    args.setJob({ active: true, title: args.title, progress: null });

    const startResponse = await fetch(args.startUrl, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(args.startBody ?? {}),
    });

    if (!startResponse.ok) {
      const payload = (await startResponse.json().catch(() => ({}))) as { error?: string };
      args.setJob({ active: false, title: args.title, progress: null });
      setMessage(`${args.title} failed to start: ${payload.error ?? "unknown error"}`);
      return;
    }

    let job = ((await startResponse.json()) as { job: JobProgress }).job;
    args.setJob({ active: true, title: args.title, progress: job });

    while (job.status === "running" || job.status === "queued") {
      const stepResponse = await fetch(args.stepUrl, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ jobId: job.id, batchSize: args.batchSize ?? 25 }),
      });

      if (!stepResponse.ok) {
        const payload = (await stepResponse.json().catch(() => ({}))) as { error?: string };
        args.setJob({ active: false, title: args.title, progress: job });
        setMessage(`${args.title} failed: ${payload.error ?? "unknown error"}`);
        await loadRuns(token, runsPage);
        await loadWindowStatus();
        return;
      }

      job = ((await stepResponse.json()) as { job: JobProgress }).job;
      args.setJob({ active: true, title: args.title, progress: job });

      if (job.status === "running" || job.status === "queued") {
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
    }

    args.setJob({ active: false, title: args.title, progress: job });

    if (job.status === "failed") {
      setMessage(`${args.title} completed with errors. ${formatProgress(job)}`);
    } else {
      setMessage(`${args.title} completed. ${formatProgress(job)}`);
    }

    await loadRuns(token, runsPage);
    await loadWindowStatus();
  }

  async function runDailySync() {
    await runJobLoop({
      startUrl: "/api/admin/sync/start",
      stepUrl: "/api/admin/sync/step",
      title: "Sync Latest",
      setJob: setSyncJob,
      startBody: { slot: "manual" },
      batchSize: 1,
    });
  }

  async function runArchiveImport() {
    await runJobLoop({
      startUrl: "/api/admin/import-archive/start",
      stepUrl: "/api/admin/import-archive/step",
      title: "Import Archive (2015+)",
      setJob: setImportJob,
      startBody: { minDate: "2015-01-01" },
      batchSize: 25,
    });
  }

  function normalizeVariantOrder(variants: VariantDefinition[]) {
    return variants.map((variant, index) => ({ ...variant, order: index + 1 }));
  }

  function updateVariant(index: number, patch: Partial<VariantDefinition>) {
    setSettings((prev) => {
      const next = prev.variantDefinitions.slice();
      const current = next[index];
      if (!current) return prev;
      next[index] = { ...current, ...patch };
      return { ...prev, variantDefinitions: normalizeVariantOrder(next) };
    });
  }

  function moveVariant(index: number, direction: -1 | 1) {
    setSettings((prev) => {
      const next = prev.variantDefinitions.slice();
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const current = next[index];
      next[index] = next[target];
      next[target] = current;
      return { ...prev, variantDefinitions: normalizeVariantOrder(next) };
    });
  }

  function removeVariant(index: number) {
    setSettings((prev) => {
      const current = prev.variantDefinitions[index];
      if (!current || CANONICAL_VARIANT_IDS.has(current.id)) return prev;
      const next = prev.variantDefinitions.filter((_, idx) => idx !== index);
      return { ...prev, variantDefinitions: normalizeVariantOrder(next) };
    });
  }

  function addVariant() {
    setSettings((prev) => {
      const id = `custom_${Date.now()}`;
      const next = prev.variantDefinitions.concat({
        id,
        label: "Custom Variant",
        multiplier: 1,
        active: true,
        order: prev.variantDefinitions.length + 1,
      });
      return { ...prev, variantDefinitions: next };
    });
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (isProduction && !token) return setMessage("Enter admin token first.");

    setLoading(true);
    setSettingsSaveStatus({ type: "idle" });

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        marketFactor: settings.marketFactor,
        variantRupeeAddon: settings.variantRupeeAddon,
        sourceUrl: settings.sourceUrl,
        keywordRules: keywordInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        variantDefinitions: normalizeVariantOrder(settings.variantDefinitions),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      const errorText = payload.error ?? "Settings update failed.";
      setSettingsSaveStatus({ type: "error", text: errorText });
      setMessage(errorText);
      return;
    }

    const now = new Date().toLocaleString("en-IN");
    setSettingsSaveStatus({ type: "success", text: "Settings saved", at: now });
    setMessage("Settings updated successfully.");
    await loadSettings(token);
  }

  async function submitManualOverride(event: FormEvent) {
    event.preventDefault();
    if (isProduction && !token) return setMessage("Enter admin token first.");
    if (!manualDate) return setMessage("Pick date for manual override.");
    if (!Number.isFinite(Number(manualAuctionAvg)) || Number(manualAuctionAvg) <= 0) {
      return setMessage("Enter valid Auction Avg value.");
    }

    const body: Record<string, unknown> = {
      date: manualDate,
      marketFactor: Number(settings.marketFactor),
      videoUrl: settings.sourceUrl,
      auctionAvg: Number(manualAuctionAvg),
    };

    const response = await fetch("/api/admin/manual-override", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setMessage(`Manual override failed: ${payload.error ?? "Provide valid auction average."}`);
      return;
    }

    setMessage("Manual override saved.");
    await loadRuns(token, runsPage);
  }

  return (
    <main className="min-h-screen bg-[#090D0A] text-slate-100 font-sans selection:bg-[#c38a3a]/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <header className="rounded-2xl border border-[#1A261E] bg-[#0E1511] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Control Center</h1>
            <Image src="/Obaol.png" alt="OBAOL Logo" width={160} height={40} className="h-8 w-auto object-contain opacity-90" priority />
          </div>
          <p className="mt-1 text-sm text-slate-400">Daily live sync operations.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs ${badgeClass(windowStatus.slot1100)}`}>
              12:15 IST: {windowStatus.slot1100}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs ${badgeClass(windowStatus.slot1400)}`}>
              14:00 IST: {windowStatus.slot1400}
            </span>
          </div>
        </header>

        <section className="rounded-2xl border border-[#1A261E] bg-[#0E1511] p-4">
          {isProduction ? (
            <form onSubmit={saveToken} className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Admin Bearer Token</label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full rounded-lg border border-[#1A261E] bg-[#090D0A] px-3 py-2 text-sm text-slate-200"
                  placeholder="Enter ADMIN_API_TOKEN"
                />
                <p className="mt-1 text-xs text-slate-500">Use the value set as `ADMIN_API_TOKEN` in your environment.</p>
              </div>
              <button type="submit" className="rounded-lg bg-[#c38a3a] px-4 py-2 text-sm font-bold text-[#090D0A]">
                Save Token
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-400">
              Local mode: admin token is bypassed for easier setup. Production requires `ADMIN_API_TOKEN`.
            </p>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#1A261E] bg-[#0E1511] p-4 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Sync Controls</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button disabled={loading || syncJob.active} onClick={() => void runDailySync()} className="rounded-lg border border-[#c38a3a]/40 bg-[#c38a3a]/10 px-3 py-2 text-sm text-[#c38a3a] disabled:opacity-50 hover:bg-[#c38a3a]/20 transition-colors">Sync Latest</button>
            </div>
            <p className="mt-3 text-xs text-slate-500">Sync action now shows live progress until completion.</p>
          </div>

          <div className="rounded-2xl border border-[#1A261E] bg-[#0E1511] p-4 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Manual Override</h2>
            <form onSubmit={submitManualOverride} className="mt-3 space-y-2">
              <input type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} className="w-full rounded-lg border border-[#1A261E] bg-[#090D0A] px-3 py-2 text-sm text-slate-200" />
              <input type="number" step="0.01" placeholder="Auction Avg (required)" value={manualAuctionAvg} onChange={(e) => setManualAuctionAvg(e.target.value)} className="w-full rounded-lg border border-[#1A261E] bg-[#090D0A] px-3 py-2 text-sm text-slate-200" />
              <button type="submit" className="rounded-lg border border-[#c38a3a]/40 bg-[#c38a3a]/10 px-3 py-2 text-sm text-[#c38a3a] hover:bg-[#c38a3a]/20 transition-colors">Save Manual Override</button>
            </form>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="rounded-2xl border border-[#1A261E] bg-[#0E1511] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sync Latest Progress</h3>
            <div className="mt-2 h-2 rounded-full bg-[#090D0A] overflow-hidden">
              <div className="h-2 rounded-full bg-[#c38a3a] transition-all duration-300" style={{ width: `${syncJob.progress?.progressPercent ?? 0}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{formatProgress(syncJob.progress)}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Pricing Settings</h2>
            <button type="button" onClick={addVariant} className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-200">Add Variant</button>
          </div>
          <form onSubmit={saveSettings} className="space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
              <label className="text-sm text-slate-300">
                Market Factor
                <input
                  type="number"
                  step="0.0001"
                  value={settings.marketFactor}
                  onChange={(e) => setSettings((prev) => ({ ...prev, marketFactor: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </label>

              <label className="text-sm text-slate-300">
                Variant Rupee Add-On (₹)
                <input
                  type="number"
                  step="0.01"
                  value={settings.variantRupeeAddon}
                  onChange={(e) => setSettings((prev) => ({ ...prev, variantRupeeAddon: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">Applied to all live variants. AP is not affected.</p>
              </label>

              <label className="text-sm text-slate-300 md:col-span-2">
                Spices Board Source URL
                <input
                  type="url"
                  value={settings.sourceUrl}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      sourceUrl: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </label>

              <label className="text-sm text-slate-300 md:col-span-3">
                Keyword Rules (comma-separated)
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Variant Manager (add, pause, reorder)</p>
              {settings.variantDefinitions.map((variant, index) => {
                const canRemove = !CANONICAL_VARIANT_IDS.has(variant.id);
                return (
                  <div key={variant.id} className="grid gap-2 rounded-lg border border-slate-800 bg-slate-900/50 p-2 md:grid-cols-[2fr_1fr_auto_auto_auto_auto]">
                    <input
                      value={variant.label}
                      onChange={(e) => updateVariant(index, { label: e.target.value })}
                      className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
                      placeholder="Variant label"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={variant.multiplier}
                      onChange={(e) => updateVariant(index, { multiplier: Number(e.target.value) })}
                      className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
                    />
                    <label className="flex items-center gap-1 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={variant.active}
                        onChange={(e) => updateVariant(index, { active: e.target.checked })}
                      />
                      Active
                    </label>
                    <button type="button" onClick={() => moveVariant(index, -1)} className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200" disabled={index === 0}>Up</button>
                    <button type="button" onClick={() => moveVariant(index, 1)} className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200" disabled={index === settings.variantDefinitions.length - 1}>Down</button>
                    <button type="button" onClick={() => removeVariant(index)} className="rounded border border-red-500/40 px-2 py-1 text-xs text-red-200 disabled:opacity-40" disabled={!canRemove}>Remove</button>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Calculation Preview</p>
              <p className="text-xs text-slate-500">
                Formula: Variant = (AP × Market Factor × Variant Multiplier) + Add-On
              </p>
              <p className="text-xs text-slate-500">
                AP used for preview: {latestAuctionAvg !== null ? `₹${latestAuctionAvg.toLocaleString("en-IN")}` : "No latest AP found yet"}
              </p>
              {latestAuctionAvg !== null ? (
                <div className="space-y-1">
                  {settings.variantDefinitions
                    .filter((variant) => variant.active)
                    .map((variant) => {
                      const value = ((latestAuctionAvg * settings.marketFactor * variant.multiplier) + settings.variantRupeeAddon);
                      const roundedValue = Math.round(value * 100) / 100;
                      return (
                        <p key={variant.id} className="text-xs text-slate-300">
                          {variant.label} = ({latestAuctionAvg.toFixed(2)} × {settings.marketFactor.toFixed(4)} × {variant.multiplier.toFixed(4)}) + {settings.variantRupeeAddon.toFixed(2)} = ₹{roundedValue.toLocaleString("en-IN")}
                        </p>
                      );
                    })}
                </div>
              ) : null}
            </div>

            <button type="submit" className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">Save Settings</button>
            {settingsSaveStatus.type === "success" ? (
              <p className="text-xs text-emerald-300">{settingsSaveStatus.text} at {settingsSaveStatus.at}</p>
            ) : null}
            {settingsSaveStatus.type === "error" ? (
              <p className="text-xs text-red-300">{settingsSaveStatus.text}</p>
            ) : null}
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Recent Sync Runs</h2>
            <button onClick={() => void loadRuns(token, runsPage)} className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Source Ref</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Started</th>
                  <th className="pb-2">Finished</th>
                  <th className="pb-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {runs.items.map((run) => (
                  <tr key={run.id} className="border-t border-slate-800">
                    <td className="py-2">{String(run.runDate).slice(0, 10)}</td>
                    <td className="py-2">{run.runType}</td>
                    <td className="py-2">{run.videoId ?? "-"}</td>
                    <td className="py-2">{run.status}</td>
                    <td className="py-2">{new Date(run.startedAt).toLocaleString("en-IN")}</td>
                    <td className="py-2">{run.finishedAt ? new Date(run.finishedAt).toLocaleString("en-IN") : "-"}</td>
                    <td className="py-2 text-red-300">{run.error ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Page {runs.page} of {runs.totalPages} · {runs.total} runs</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRunsPage((prev) => Math.max(prev - 1, 1))}
                disabled={runs.page <= 1}
                className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setRunsPage((prev) => Math.min(prev + 1, runs.totalPages || 1))}
                disabled={runs.page >= runs.totalPages}
                className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </main>
  );
}
