/**
 * Decodes the payload of a JWT without verifying the signature.
 * Uses atob() for Edge Runtime compatibility (no external deps).
 *
 * Returns the parsed payload, or null if the token is malformed.
 */
export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Base64url → Base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Returns true if the JWT is expired or will expire within `thresholdSeconds`.
 * Also returns true if the token is malformed or has no `exp` claim.
 */
export function isTokenExpiredOrExpiringSoon(
  token: string,
  thresholdSeconds: number,
): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp - nowSeconds <= thresholdSeconds;
}
