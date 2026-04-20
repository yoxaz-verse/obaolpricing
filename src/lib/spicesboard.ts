import { createHash } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { RunStatus, RunType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getMarketFactor, getSourceUrl } from "@/lib/settings";

export type SyncMode = "daily";
export type DailySyncSlot = "slot_1100" | "slot_1400" | "manual";

export type SpicesBoardRow = {
  auctionDate: Date;
  qtySoldKg: number;
  avgPrice: number;
};

type ParsedTableRow = {
  cells: string[];
};

type ExtractedSource = {
  sourceUrl: string;
  snapshotHash: string;
  rows: SpicesBoardRow[];
  rowsCount: number;
};

export type SyncSummary = {
  ok: boolean;
  mode: SyncMode;
  sourceUrl: string;
  processedDates: number;
  upserts: number;
  errors: number;
  details: Array<{ date: string; status: "success" | "failed"; error?: string; sourceRows: number }>;
};

export type ArchiveImportSummary = {
  ok: boolean;
  filePath: string;
  importedDates: number;
  upserts: number;
  errors: number;
  sourceRows: number;
  minDate: string;
  snapshotHash: string;
  details: Array<{ date: string; status: "success" | "failed"; error?: string; sourceRows: number }>;
};

export type WorkEntry = {
  date: string;
  auctionAvg: number;
  sourceRows: number;
  sourceUrl: string;
  snapshotHash: string;
  meta?: Record<string, unknown>;
};

export type PreparedArchiveWork = {
  filePath: string;
  minDate: string;
  sourceRows: number;
  snapshotHash: string;
  entries: WorkEntry[];
};

export type PreparedSyncWork = {
  sourceUrl: string;
  entries: WorkEntry[];
};

const DATE_DD_MM_YYYY = /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/;
const DATE_DD_MON_YYYY = /^(\d{1,2})[-\/.]([A-Za-z]{3,9})[-\/.](\d{4})$/;
const DATE_YYYY_MM_DD = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/;

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const DEFAULT_ARCHIVE_MIN_DATE = "2015-01-01";

function stripTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(raw: string) {
  const cleaned = raw.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function parseDateValue(raw: string): Date | null {
  const value = raw.trim();

  const yyyymmdd = value.match(DATE_YYYY_MM_DD);
  if (yyyymmdd) {
    const year = Number(yyyymmdd[1]);
    const month = Number(yyyymmdd[2]) - 1;
    const day = Number(yyyymmdd[3]);
    const parsed = new Date(Date.UTC(year, month, day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const ddmmyyyy = value.match(DATE_DD_MM_YYYY);
  if (ddmmyyyy) {
    const day = Number(ddmmyyyy[1]);
    const month = Number(ddmmyyyy[2]) - 1;
    const year = Number(ddmmyyyy[3]);
    const parsed = new Date(Date.UTC(year, month, day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const ddmonyyyy = value.match(DATE_DD_MON_YYYY);
  if (ddmonyyyy) {
    const day = Number(ddmonyyyy[1]);
    const month = MONTH_MAP[ddmonyyyy[2].toLowerCase()];
    const year = Number(ddmonyyyy[3]);
    if (month === undefined) return null;
    const parsed = new Date(Date.UTC(year, month, day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function toDateOnly(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateKey(date: Date) {
  return toDateOnly(date).toISOString().slice(0, 10);
}

function parseRowsFromTable(tableHtml: string): ParsedTableRow[] {
  const trMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

  return trMatches
    .map((rowHtml) => {
      const cellMatches = rowHtml.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? [];
      const cells = cellMatches.map((cell) => stripTags(cell));
      return { cells };
    })
    .filter((row) => row.cells.length > 0);
}

function inferColumnIndices(rows: ParsedTableRow[]) {
  const headerRow = rows.find((row) =>
    row.cells.some((cell) => /date/i.test(cell)) && row.cells.some((cell) => /avg\.?\s*price/i.test(cell)),
  );

  if (!headerRow) {
    return null;
  }

  const dateIndex = headerRow.cells.findIndex((cell) => /date/i.test(cell));
  const qtyIndex = headerRow.cells.findIndex((cell) => /qty|quantity/i.test(cell));
  const avgIndex = headerRow.cells.findIndex((cell) => /avg\.?\s*price/i.test(cell));

  if (dateIndex < 0 || qtyIndex < 0 || avgIndex < 0) {
    return null;
  }

  return { dateIndex, qtyIndex, avgIndex };
}

function parseStructuredRows(rows: ParsedTableRow[]): SpicesBoardRow[] {
  const inferred = inferColumnIndices(rows);
  if (!inferred) return [];

  const parsed: SpicesBoardRow[] = [];

  for (const row of rows) {
    if (Math.max(inferred.dateIndex, inferred.qtyIndex, inferred.avgIndex) >= row.cells.length) {
      continue;
    }

    const parsedDate = parseDateValue(row.cells[inferred.dateIndex] ?? "");
    if (!parsedDate) continue;

    const qtySoldKg = parseNumber(row.cells[inferred.qtyIndex] ?? "");
    const avgPrice = parseNumber(row.cells[inferred.avgIndex] ?? "");

    if (!Number.isFinite(qtySoldKg) || !Number.isFinite(avgPrice) || qtySoldKg <= 0 || avgPrice <= 0) {
      continue;
    }

    parsed.push({
      auctionDate: toDateOnly(parsedDate),
      qtySoldKg,
      avgPrice,
    });
  }

  return parsed;
}

function parseFallbackRows(rows: ParsedTableRow[]): SpicesBoardRow[] {
  const parsed: SpicesBoardRow[] = [];

  for (const row of rows) {
    const dateCell = row.cells.find((cell) => parseDateValue(cell) !== null);
    if (!dateCell) continue;
    const parsedDate = parseDateValue(dateCell);
    if (!parsedDate) continue;

    const numericCells = row.cells
      .map((cell) => parseNumber(cell))
      .filter((value) => Number.isFinite(value));

    if (numericCells.length < 2) continue;

    const avgPrice = numericCells[numericCells.length - 1];
    const qtySoldKg = numericCells[numericCells.length - 2];

    if (qtySoldKg <= 0 || avgPrice <= 0) continue;

    parsed.push({
      auctionDate: toDateOnly(parsedDate),
      qtySoldKg,
      avgPrice,
    });
  }

  return parsed;
}

export function parseSpicesBoardRows(html: string): SpicesBoardRow[] {
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) ?? [];

  let rows: SpicesBoardRow[] = [];

  for (const table of tables) {
    const tableRows = parseRowsFromTable(table);
    const structured = parseStructuredRows(tableRows);

    if (structured.length > 0) {
      rows = rows.concat(structured);
      continue;
    }

    const fallback = parseFallbackRows(tableRows);
    rows = rows.concat(fallback);
  }

  if (rows.length === 0) {
    const allRows = parseRowsFromTable(html);
    rows = parseFallbackRows(allRows);
  }

  return rows;
}

function weightedAverage(rows: SpicesBoardRow[]) {
  const totalQty = rows.reduce((sum, row) => sum + row.qtySoldKg, 0);
  if (totalQty <= 0) return null;

  const weightedTotal = rows.reduce((sum, row) => sum + row.avgPrice * row.qtySoldKg, 0);
  return Math.round((weightedTotal / totalQty) * 100) / 100;
}

export function aggregateWeightedApByDate(rows: SpicesBoardRow[]) {
  const groupedByDate = new Map<string, SpicesBoardRow[]>();
  for (const row of rows) {
    const key = dateKey(row.auctionDate);
    const bucket = groupedByDate.get(key) ?? [];
    bucket.push(row);
    groupedByDate.set(key, bucket);
  }

  const result = new Map<string, { auctionAvg: number; rows: SpicesBoardRow[] }>();
  groupedByDate.forEach((bucket, key) => {
    const auctionAvg = weightedAverage(bucket);
    if (!auctionAvg || auctionAvg <= 0) return;
    result.set(key, { auctionAvg, rows: bucket });
  });
  return result;
}

export function filterRowsByMinDate(rows: SpicesBoardRow[], minDateIso: string) {
  const minDate = new Date(`${minDateIso}T00:00:00.000Z`);
  return rows.filter((row) => row.auctionDate.getTime() >= minDate.getTime());
}

async function fetchSource(sourceUrl: string): Promise<ExtractedSource> {
  const response = await fetch(sourceUrl, { method: "GET", cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Source unreachable (${response.status})`);
  }

  const html = await response.text();
  const rows = parseSpicesBoardRows(html);

  if (rows.length === 0) {
    throw new Error("Source parse failed: no auction rows found (table structure may have changed)");
  }

  return {
    sourceUrl,
    snapshotHash: createHash("sha256").update(html).digest("hex"),
    rows,
    rowsCount: rows.length,
  };
}

async function startRun(runType: RunType, runDate: Date, sourceRef?: string) {
  return prisma.extractionRun.create({
    data: {
      runType,
      runDate: toDateOnly(runDate),
      status: RunStatus.processing,
      videoId: sourceRef ?? null,
      attemptedTimestamps: [],
      rawOcrOutputs: [],
      startedAt: new Date(),
    },
  });
}

async function completeRun(
  runId: string,
  input: {
    status: RunStatus;
    sourceUrl: string;
    sourceRowsCount: number;
    snapshotHash: string;
    error?: string;
    runContext?: Record<string, unknown>;
  },
) {
  await prisma.extractionRun.update({
    where: { id: runId },
    data: {
      status: input.status,
      error: input.error ?? null,
      rawOcrOutputs: [
        {
          source_url: input.sourceUrl,
          source_rows_count: input.sourceRowsCount,
          snapshot_hash: input.snapshotHash,
          ...(input.runContext ?? {}),
        },
      ],
      finishedAt: new Date(),
    },
  });
}

async function upsertCanonicalPrice(day: string, auctionAvg: number, marketFactor: number, sourceUrl: string) {
  const runDate = new Date(`${day}T00:00:00.000Z`);
  const roundedAuctionAvg = Math.round(auctionAvg * 100) / 100;

  await prisma.auctionPrice.upsert({
    where: { date: runDate },
    update: {
      videoUrl: sourceUrl,
      auctionAvg: roundedAuctionAvg,
      marketFactor,
      extractedAt: new Date(),
    },
    create: {
      date: runDate,
      videoUrl: sourceUrl,
      auctionAvg: roundedAuctionAvg,
      marketFactor,
      extractedAt: new Date(),
    },
  });
}

export async function prepareDailySyncWork(input?: { slot?: DailySyncSlot }): Promise<PreparedSyncWork> {
  const slot = input?.slot ?? "manual";
  const sourceUrl = await getSourceUrl();
  const source = await fetchSource(sourceUrl);
  const weightedByDate = aggregateWeightedApByDate(source.rows);
  const sortedDates = Array.from(weightedByDate.keys()).sort();
  const latestDate = sortedDates[sortedDates.length - 1];

  if (!latestDate) {
    throw new Error("No valid auction rows found from source");
  }

  const record = weightedByDate.get(latestDate);
  if (!record) {
    throw new Error("Latest source row is unavailable");
  }

  return {
    sourceUrl: source.sourceUrl,
    entries: [
      {
        date: latestDate,
        auctionAvg: record.auctionAvg,
        sourceRows: record.rows.length,
        sourceUrl: source.sourceUrl,
        snapshotHash: source.snapshotHash,
        meta: {
          operation: "daily_sync",
          slot,
          aggregation: "qty_weighted_avg_price",
        },
      },
    ],
  };
}

export async function prepareArchiveImportWork(input?: {
  filePath?: string;
  minDate?: string;
}): Promise<PreparedArchiveWork> {
  const resolvedPath = input?.filePath
    ? path.resolve(process.cwd(), input.filePath)
    : path.resolve(process.cwd(), process.env.ARCHIVE_FILE_PATH ?? "./cardamompricearchieve.xls");

  const minDate = input?.minDate ?? DEFAULT_ARCHIVE_MIN_DATE;
  const archiveBuffer = await readFile(resolvedPath);
  const html = archiveBuffer.toString("utf-8");
  const snapshotHash = createHash("sha256").update(html).digest("hex");
  const sourceRows = parseSpicesBoardRows(html);
  const filteredRows = filterRowsByMinDate(sourceRows, minDate);
  const weightedByDate = aggregateWeightedApByDate(filteredRows);
  const dates = Array.from(weightedByDate.keys()).sort();

  if (!dates.length) {
    throw new Error(`No valid archive rows found on or after ${minDate}`);
  }

  const entries: WorkEntry[] = dates.map((day) => {
    const record = weightedByDate.get(day);
    return {
      date: day,
      auctionAvg: record?.auctionAvg ?? 0,
      sourceRows: record?.rows.length ?? 0,
      sourceUrl: "archive://cardamompricearchieve.xls",
      snapshotHash,
      meta: {
        operation: "archive_import",
        min_date: minDate,
        archive_file: resolvedPath,
        aggregation: "qty_weighted_avg_price",
      },
    };
  });

  return {
    filePath: resolvedPath,
    minDate,
    sourceRows: sourceRows.length,
    snapshotHash,
    entries,
  };
}

export async function processWorkEntry(input: {
  entry: WorkEntry;
  runType: RunType;
  sourceRef: string;
  marketFactor?: number;
}) {
  const marketFactor = Number.isFinite(Number(input.marketFactor)) && Number(input.marketFactor) > 0
    ? Number(input.marketFactor)
    : await getMarketFactor();
  const runDate = new Date(`${input.entry.date}T00:00:00.000Z`);
  const run = await startRun(input.runType, runDate, input.sourceRef);

  try {
    if (!Number.isFinite(input.entry.auctionAvg) || input.entry.auctionAvg <= 0) {
      throw new Error("Unable to compute weighted Avg.Price");
    }

    await upsertCanonicalPrice(input.entry.date, input.entry.auctionAvg, marketFactor, input.entry.sourceUrl);

    await completeRun(run.id, {
      status: RunStatus.success,
      sourceUrl: input.entry.sourceUrl,
      sourceRowsCount: input.entry.sourceRows,
      snapshotHash: input.entry.snapshotHash,
      runContext: {
        date: input.entry.date,
        ...(input.entry.meta ?? {}),
      },
    });

    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    await completeRun(run.id, {
      status: RunStatus.failed,
      sourceUrl: input.entry.sourceUrl,
      sourceRowsCount: input.entry.sourceRows,
      snapshotHash: input.entry.snapshotHash,
      error: message,
      runContext: {
        date: input.entry.date,
        ...(input.entry.meta ?? {}),
      },
    });

    return { ok: false as const, error: message };
  }
}

export async function syncSpicesBoard(input?: { slot?: DailySyncSlot }): Promise<SyncSummary> {
  const slot = input?.slot ?? "manual";
  const marketFactor = await getMarketFactor();
  const prepared = await prepareDailySyncWork({ slot });
  const entry = prepared.entries[0];

  const summary: SyncSummary = {
    ok: true,
    mode: "daily",
    sourceUrl: prepared.sourceUrl,
    processedDates: prepared.entries.length,
    upserts: 0,
    errors: 0,
    details: [],
  };

  if (entry) {
    const result = await processWorkEntry({
      entry,
      runType: RunType.daily,
      sourceRef: slot,
      marketFactor,
    });

    if (result.ok) {
      summary.upserts = 1;
      summary.details.push({ date: entry.date, status: "success", sourceRows: entry.sourceRows });
    } else {
      summary.ok = false;
      summary.errors = 1;
      summary.details.push({ date: entry.date, status: "failed", error: result.error, sourceRows: entry.sourceRows });
    }
  } else {
    summary.ok = false;
    summary.errors = 1;
    summary.details.push({ date: "-", status: "failed", error: "No latest entry found", sourceRows: 0 });
  }

  return summary;
}

export async function importArchiveFile(input?: {
  filePath?: string;
  minDate?: string;
}): Promise<ArchiveImportSummary> {
  const [prepared, marketFactor] = await Promise.all([
    prepareArchiveImportWork(input),
    getMarketFactor(),
  ]);

  const summary: ArchiveImportSummary = {
    ok: true,
    filePath: prepared.filePath,
    importedDates: prepared.entries.length,
    upserts: 0,
    errors: 0,
    sourceRows: prepared.sourceRows,
    minDate: prepared.minDate,
    snapshotHash: prepared.snapshotHash,
    details: [],
  };

  for (const entry of prepared.entries) {
    const result = await processWorkEntry({
      entry,
      runType: RunType.manual,
      sourceRef: "archive_import",
      marketFactor,
    });

    if (result.ok) {
      summary.upserts += 1;
      summary.details.push({ date: entry.date, status: "success", sourceRows: entry.sourceRows });
      continue;
    }

    summary.ok = false;
    summary.errors += 1;
    summary.details.push({ date: entry.date, status: "failed", error: result.error, sourceRows: entry.sourceRows });
  }

  return summary;
}
