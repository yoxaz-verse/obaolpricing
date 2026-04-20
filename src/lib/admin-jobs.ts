import { AdminJobStatus, AdminJobType, RunType, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  prepareArchiveImportWork,
  prepareDailySyncWork,
  processWorkEntry,
  type DailySyncSlot,
  type WorkEntry,
} from "@/lib/spicesboard";

type JobMeta = {
  operation: "archive_import" | "sync_latest";
  slot?: DailySyncSlot;
  sourceUrl?: string;
  minDate?: string;
  filePath?: string;
  snapshotHash?: string;
  sourceRows?: number;
  entries: WorkEntry[];
};

export type JobProgress = {
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
  meta: Omit<JobMeta, "entries"> & { entriesPreviewCount: number };
};

function clampBatchSize(value?: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 25;
  return Math.min(Math.max(Math.floor(parsed), 1), 250);
}

function toJsonMeta(meta: JobMeta): Prisma.JsonObject {
  const entries = JSON.parse(JSON.stringify(meta.entries)) as Prisma.JsonArray;
  return {
    operation: meta.operation,
    slot: meta.slot ?? null,
    sourceUrl: meta.sourceUrl ?? null,
    minDate: meta.minDate ?? null,
    filePath: meta.filePath ?? null,
    snapshotHash: meta.snapshotHash ?? null,
    sourceRows: meta.sourceRows ?? null,
    entries,
  };
}

function parseMeta(value: Prisma.JsonValue): JobMeta {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Job metadata is invalid");
  }

  const obj = value as Record<string, unknown>;
  const entriesRaw = Array.isArray(obj.entries) ? obj.entries : [];
  const entries: WorkEntry[] = [];
  for (const entry of entriesRaw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const date = String(row.date ?? "").slice(0, 10);
    const auctionAvg = Number(row.auctionAvg);
    const sourceRows = Number(row.sourceRows);
    const sourceUrl = String(row.sourceUrl ?? "");
    const snapshotHash = String(row.snapshotHash ?? "");
    const meta = row.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
      ? (row.meta as Record<string, unknown>)
      : undefined;

    if (!date || !Number.isFinite(auctionAvg) || !Number.isFinite(sourceRows) || !sourceUrl || !snapshotHash) {
      continue;
    }

    entries.push({
      date,
      auctionAvg,
      sourceRows,
      sourceUrl,
      snapshotHash,
      meta,
    });
  }

  const operation = obj.operation === "archive_import" ? "archive_import" : "sync_latest";

  return {
    operation,
    slot: obj.slot === "slot_1100" || obj.slot === "slot_1400" || obj.slot === "manual"
      ? obj.slot
      : undefined,
    sourceUrl: typeof obj.sourceUrl === "string" ? obj.sourceUrl : undefined,
    minDate: typeof obj.minDate === "string" ? obj.minDate : undefined,
    filePath: typeof obj.filePath === "string" ? obj.filePath : undefined,
    snapshotHash: typeof obj.snapshotHash === "string" ? obj.snapshotHash : undefined,
    sourceRows: Number.isFinite(Number(obj.sourceRows)) ? Number(obj.sourceRows) : undefined,
    entries,
  };
}

function toProgress(job: {
  id: string;
  jobType: AdminJobType;
  status: AdminJobStatus;
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  message: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  meta: Prisma.JsonValue;
}): JobProgress {
  const meta = parseMeta(job.meta);
  const progressPercent = job.totalItems > 0
    ? Math.min(100, Math.round((job.processedItems / job.totalItems) * 100))
    : 0;

  return {
    id: job.id,
    jobType: job.jobType,
    status: job.status,
    totalItems: job.totalItems,
    processedItems: job.processedItems,
    successCount: job.successCount,
    errorCount: job.errorCount,
    message: job.message,
    startedAt: job.startedAt ? job.startedAt.toISOString() : null,
    finishedAt: job.finishedAt ? job.finishedAt.toISOString() : null,
    progressPercent,
    meta: {
      operation: meta.operation,
      slot: meta.slot,
      sourceUrl: meta.sourceUrl,
      minDate: meta.minDate,
      filePath: meta.filePath,
      snapshotHash: meta.snapshotHash,
      sourceRows: meta.sourceRows,
      entriesPreviewCount: meta.entries.length,
    },
  };
}

export async function startArchiveImportJob(input?: { filePath?: string; minDate?: string }) {
  const prepared = await prepareArchiveImportWork(input);
  const job = await prisma.adminJob.create({
    data: {
      jobType: AdminJobType.archive_import,
      status: AdminJobStatus.running,
      totalItems: prepared.entries.length,
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      message: "Archive import job initialized",
      startedAt: new Date(),
      meta: toJsonMeta({
        operation: "archive_import",
        filePath: prepared.filePath,
        minDate: prepared.minDate,
        snapshotHash: prepared.snapshotHash,
        sourceRows: prepared.sourceRows,
        entries: prepared.entries,
      }),
    },
  });

  return toProgress(job);
}

export async function startSyncJob(input?: { slot?: DailySyncSlot }) {
  const slot = input?.slot ?? "manual";
  const prepared = await prepareDailySyncWork({ slot });

  const job = await prisma.adminJob.create({
    data: {
      jobType: AdminJobType.sync_latest,
      status: AdminJobStatus.running,
      totalItems: prepared.entries.length,
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      message: "Daily sync job initialized",
      startedAt: new Date(),
      meta: toJsonMeta({
        operation: "sync_latest",
        slot,
        sourceUrl: prepared.sourceUrl,
        entries: prepared.entries,
      }),
    },
  });

  return toProgress(job);
}

export async function getAdminJobProgress(jobId: string) {
  const job = await prisma.adminJob.findUnique({ where: { id: jobId } });
  if (!job) return null;
  return toProgress(job);
}

export async function runAdminJobStep(input: { jobId: string; batchSize?: number }) {
  const batchSize = clampBatchSize(input.batchSize);
  const job = await prisma.adminJob.findUnique({ where: { id: input.jobId } });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.status === AdminJobStatus.completed || job.status === AdminJobStatus.failed) {
    return toProgress(job);
  }

  const meta = parseMeta(job.meta);

  const startIndex = job.processedItems;
  const batch = meta.entries.slice(startIndex, startIndex + batchSize);

  if (batch.length === 0) {
    const finished = await prisma.adminJob.update({
      where: { id: job.id },
      data: {
        status: job.errorCount > 0 && job.successCount === 0 ? AdminJobStatus.failed : AdminJobStatus.completed,
        finishedAt: new Date(),
        message: "Job already processed",
      },
    });

    return toProgress(finished);
  }

  let processedItems = job.processedItems;
  let successCount = job.successCount;
  let errorCount = job.errorCount;
  let status: AdminJobStatus = AdminJobStatus.running;
  let message = `Processed ${job.processedItems}/${job.totalItems}`;

  try {
    for (const entry of batch) {
      const result = await processWorkEntry({
        entry,
        runType: job.jobType === AdminJobType.sync_latest ? RunType.daily : RunType.manual,
        sourceRef: job.jobType === AdminJobType.sync_latest ? (meta.slot ?? "manual") : "archive_import",
      });

      processedItems += 1;
      if (result.ok) {
        successCount += 1;
      } else {
        errorCount += 1;
      }
    }

    if (processedItems >= job.totalItems) {
      status = errorCount > 0 && successCount === 0 ? AdminJobStatus.failed : AdminJobStatus.completed;
      message = errorCount > 0
        ? `Completed with ${errorCount} error(s)`
        : "Completed successfully";
    } else {
      message = `Processed ${processedItems}/${job.totalItems}`;
    }
  } catch (error) {
    status = AdminJobStatus.failed;
    errorCount += 1;
    message = error instanceof Error ? error.message : "Unknown job step error";
  }

  const updated = await prisma.adminJob.update({
    where: { id: job.id },
    data: {
      status,
      processedItems,
      successCount,
      errorCount,
      message,
      finishedAt: status === AdminJobStatus.running ? null : new Date(),
    },
  });

  return toProgress(updated);
}
