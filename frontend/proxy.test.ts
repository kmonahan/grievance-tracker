import { NextResponse } from "next/server";
import { isTokenExpiredOrExpiringSoon } from "~/app/lib/jwt";

jest.mock("~/app/lib/jwt", () => ({
  isTokenExpiredOrExpiringSoon: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
}));

global.fetch = jest.fn();

// eslint-disable-next-line import/first
import { proxy } from "./proxy";

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z").getTime();

// Build a minimal NextRequest-shaped object that matches what the proxy accesses.
function makeRequest(pathname: string, cookies: Record<string, string> = {}) {
  return {
    nextUrl: { pathname },
    url: `http://localhost${pathname}`,
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value !== undefined ? { value } : undefined;
      },
    },
  };
}

let mockCookiesSet: jest.Mock;

beforeEach(() => {
  process.env.BACKEND_URL = "http://localhost:8000";
  delete process.env.NODE_ENV;
  jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);

  mockCookiesSet = jest.fn();

  jest.mocked(NextResponse.next).mockReturnValue({
    cookies: { set: mockCookiesSet },
  } as unknown as ReturnType<typeof NextResponse.next>);

  jest.mocked(NextResponse.redirect).mockImplementation(
    (url) =>
      ({
        cookies: { set: jest.fn() },
        location: url,
      }) as unknown as ReturnType<typeof NextResponse.redirect>,
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("unauthenticated (no cookies)", () => {
  beforeEach(() => {
    jest.mocked(isTokenExpiredOrExpiringSoon).mockReturnValue(true);
  });

  it("allows access to /login without redirecting", async () => {
    const request = makeRequest("/login");

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("redirects to /login when accessing a protected route", async () => {
    const request = makeRequest("/");

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" }),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });

  it("redirects to /login when accessing a nested protected route", async () => {
    const request = makeRequest("/grievances/create");

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" }),
    );
  });
});

describe("authenticated (valid, non-expiring access token)", () => {
  beforeEach(() => {
    jest.mocked(isTokenExpiredOrExpiringSoon).mockReturnValue(false);
  });

  it("allows access to a protected route without redirecting", async () => {
    const request = makeRequest("/", { access_token: "valid-token" });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("redirects authenticated users away from /login to /", async () => {
    const request = makeRequest("/login", { access_token: "valid-token" });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/" }),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });

  it("does not set a new access_token cookie when the token is still valid", async () => {
    const request = makeRequest("/", { access_token: "valid-token" });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(mockCookiesSet).not.toHaveBeenCalled();
  });
});

describe("token refresh — expiring soon access token with refresh token", () => {
  beforeEach(() => {
    jest.mocked(isTokenExpiredOrExpiringSoon).mockReturnValue(true);
  });

  it("calls the refresh endpoint with the refresh token as Bearer", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "new-access-token" }),
    });

    const request = makeRequest("/", {
      access_token: "expiring-token",
      refresh_token: "my-refresh-token",
    });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/refresh", {
      method: "POST",
      headers: { Authorization: "Bearer my-refresh-token" },
    });
  });

  it("allows the request and sets the new access_token cookie on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "new-access-token" }),
    });

    const request = makeRequest("/", {
      access_token: "expiring-token",
      refresh_token: "my-refresh-token",
    });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(mockCookiesSet).toHaveBeenCalledWith(
      "access_token",
      "new-access-token",
      {
        httpOnly: true,
        secure: false,
        path: "/",
        expires: new Date(FIXED_NOW + 60 * 60 * 1000),
      },
    );
  });

  it("sets secure: true on the cookie in production", async () => {
    process.env.NODE_ENV = "production";
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "new-access-token" }),
    });

    const request = makeRequest("/", {
      access_token: "expiring-token",
      refresh_token: "my-refresh-token",
    });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(mockCookiesSet).toHaveBeenCalledWith(
      "access_token",
      "new-access-token",
      expect.objectContaining({ secure: true }),
    );
  });

  it("redirects to /login when refresh fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const request = makeRequest("/", {
      access_token: "expiring-token",
      refresh_token: "my-refresh-token",
    });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" }),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });
});

describe("no access token but valid refresh token", () => {
  beforeEach(() => {
    // isTokenExpiredOrExpiringSoon won't be called (no access_token), but set anyway
    jest.mocked(isTokenExpiredOrExpiringSoon).mockReturnValue(true);
  });

  it("refreshes and allows access on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "fresh-token" }),
    });

    const request = makeRequest("/", {
      refresh_token: "my-refresh-token",
    });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(mockCookiesSet).toHaveBeenCalledWith(
      "access_token",
      "fresh-token",
      expect.objectContaining({ httpOnly: true, path: "/" }),
    );
  });

  it("redirects to /login when refresh fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const request = makeRequest("/", {
      refresh_token: "my-refresh-token",
    });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" }),
    );
  });

  it("does not call isTokenExpiredOrExpiringSoon when there is no access token", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "fresh-token" }),
    });

    const request = makeRequest("/", { refresh_token: "my-refresh-token" });

    await proxy(request as Parameters<typeof proxy>[0]);

    expect(isTokenExpiredOrExpiringSoon).not.toHaveBeenCalled();
  });
});
