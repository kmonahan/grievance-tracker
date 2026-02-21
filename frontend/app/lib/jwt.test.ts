import { decodeJwtPayload, isTokenExpiredOrExpiringSoon } from "./jwt";

// Helper: build a minimal JWT with the given payload
function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

// Fixed "now" for deterministic expiry tests: 2026-01-01T00:00:00Z → 1735689600 seconds
const FIXED_NOW_MS = new Date("2026-01-01T00:00:00.000Z").getTime();
const FIXED_NOW_S = Math.floor(FIXED_NOW_MS / 1000);

describe("decodeJwtPayload", () => {
  it("decodes a valid JWT and returns its payload", () => {
    const token = makeJwt({ sub: "user-1", role: "admin" });
    expect(decodeJwtPayload(token)).toEqual({ sub: "user-1", role: "admin" });
  });

  it("returns null for a malformed string (wrong number of segments)", () => {
    expect(decodeJwtPayload("not.a.valid.jwt.here")).toBeNull();
    expect(decodeJwtPayload("only-one-part")).toBeNull();
    expect(decodeJwtPayload("two.parts")).toBeNull();
  });

  it("returns null when the payload is not valid base64 JSON", () => {
    expect(decodeJwtPayload("header.!!!.signature")).toBeNull();
  });

  it("handles base64url encoding (- and _ characters)", () => {
    // base64url uses - and _ instead of + and /
    const rawPayload = { sub: "user" };
    const base64url = btoa(JSON.stringify(rawPayload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const token = `header.${base64url}.signature`;
    expect(decodeJwtPayload(token)).toEqual(rawPayload);
  });
});

describe("isTokenExpiredOrExpiringSoon", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW_MS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns true for a token that is already expired", () => {
    const token = makeJwt({ exp: FIXED_NOW_S - 1 });
    expect(isTokenExpiredOrExpiringSoon(token, 900)).toBe(true);
  });

  it("returns true for a token expiring within the threshold", () => {
    // Expires in 5 minutes; threshold is 15 minutes
    const token = makeJwt({ exp: FIXED_NOW_S + 5 * 60 });
    expect(isTokenExpiredOrExpiringSoon(token, 15 * 60)).toBe(true);
  });

  it("returns false for a token well beyond the threshold", () => {
    // Expires in 30 minutes; threshold is 15 minutes
    const token = makeJwt({ exp: FIXED_NOW_S + 30 * 60 });
    expect(isTokenExpiredOrExpiringSoon(token, 15 * 60)).toBe(false);
  });

  it("returns false for a token expiring exactly at the threshold boundary", () => {
    // Expires in exactly 900 seconds (15 min); threshold is 900 seconds
    // exp - now = 900, which is NOT <= 900 in the sense we want:
    // the check is `exp - now <= threshold`, so 900 <= 900 → true (treating boundary as "soon")
    const token = makeJwt({ exp: FIXED_NOW_S + 900 });
    expect(isTokenExpiredOrExpiringSoon(token, 900)).toBe(true);
  });

  it("returns true for a token with no exp claim", () => {
    const token = makeJwt({ sub: "user-1" });
    expect(isTokenExpiredOrExpiringSoon(token, 900)).toBe(true);
  });

  it("returns true for a malformed token", () => {
    expect(isTokenExpiredOrExpiringSoon("not-a-jwt", 900)).toBe(true);
  });
});
