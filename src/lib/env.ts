const required = ["DATABASE_URL"] as const;

export function assertCoreEnv() {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

export function getMarketFactorDefault() {
  const raw = process.env.DEFAULT_MARKET_FACTOR;
  const parsed = raw ? Number(raw) : 1.02;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1.02;
  }
  return parsed;
}
