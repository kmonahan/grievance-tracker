import { env } from "~/test/helpers";
import { accessTokenCookieOptions, fetchRefreshedAccessToken } from "./token";

global.fetch = jest.fn();

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z").getTime();

describe("accessTokenCookieOptions", () => {
  beforeEach(() => {
    delete env.NODE_ENV;
    jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns httpOnly: true and path: /", () => {
    const options = accessTokenCookieOptions();
    expect(options.httpOnly).toBe(true);
    expect(options.path).toBe("/");
  });

  it("sets a 60-minute expiration", () => {
    const options = accessTokenCookieOptions();
    expect(options.expires).toEqual(new Date(FIXED_NOW + 60 * 60 * 1000));
  });

  it("sets secure: false outside of production", () => {
    expect(accessTokenCookieOptions().secure).toBe(false);
  });

  it("sets secure: true in production", () => {
    env.NODE_ENV = "production";
    expect(accessTokenCookieOptions().secure).toBe(true);
  });
});

describe("fetchRefreshedAccessToken", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
  });

  it("sends a POST to /users/refresh with the refresh token as Bearer", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "new-access-token" }),
    });

    await fetchRefreshedAccessToken("my-refresh-token");

    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/refresh", {
      method: "POST",
      headers: { Authorization: "Bearer my-refresh-token" },
    });
  });

  it("returns the new access token on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "new-access-token" }),
    });

    const result = await fetchRefreshedAccessToken("my-refresh-token");

    expect(result).toBe("new-access-token");
  });

  it("returns null when the response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const result = await fetchRefreshedAccessToken("my-refresh-token");

    expect(result).toBeNull();
  });
});
