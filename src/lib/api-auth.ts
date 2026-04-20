export function isAuthorizedFromBearer(authHeader: string | null, expectedToken: string | undefined) {
  if (!expectedToken) return false;
  if (!authHeader) return false;
  return authHeader === `Bearer ${expectedToken}`;
}

export function isAdminAuthorizedOrDevBypass(
  authHeader: string | null,
  expectedToken: string | undefined,
) {
  if (isAuthorizedFromBearer(authHeader, expectedToken)) {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

export function badAuthResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}
