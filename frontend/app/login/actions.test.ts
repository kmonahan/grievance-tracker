import { login } from "./actions";

global.fetch = jest.fn();

const mockCookiesSet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ set: mockCookiesSet })),
}));

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (path: string) => mockRedirect(path),
}));

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z").getTime();

describe("login action", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    delete process.env.NODE_ENV;
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores tokens in cookies with correct options and redirects on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "access-jwt",
        refresh_token: "refresh-jwt",
      }),
    });

    await login({ error: null }, new FormData());

    expect(mockCookiesSet).toHaveBeenCalledWith("access_token", "access-jwt", {
      httpOnly: true,
      secure: false,
      path: "/",
      expires: new Date(FIXED_NOW + 60 * 60 * 1000),
    });
    expect(mockCookiesSet).toHaveBeenCalledWith(
      "refresh_token",
      "refresh-jwt",
      {
        httpOnly: true,
        secure: false,
        path: "/",
        expires: new Date(FIXED_NOW + 28 * 24 * 60 * 60 * 1000),
      },
    );
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("sets secure: true on cookies in production", async () => {
    process.env.NODE_ENV = "production";
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "access-jwt",
        refresh_token: "refresh-jwt",
      }),
    });

    await login({ error: null }, new FormData());

    expect(mockCookiesSet).toHaveBeenCalledWith(
      "access_token",
      "access-jwt",
      expect.objectContaining({ secure: true }),
    );
    expect(mockCookiesSet).toHaveBeenCalledWith(
      "refresh_token",
      "refresh-jwt",
      expect.objectContaining({ secure: true }),
    );
  });

  it("returns the server error message on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    const result = await login({ error: null }, new FormData());

    expect(result).toEqual({ error: "Invalid credentials" });
  });

  it("returns a fallback error when the server provides no error message", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await login({ error: null }, new FormData());

    expect(result).toEqual({ error: "An error occurred. Please try again." });
  });

  it("calls the correct endpoint with POST and the submitted FormData", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "access-jwt",
        refresh_token: "refresh-jwt",
      }),
    });
    const formData = new FormData();

    await login({ error: null }, formData);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/login", {
      method: "POST",
      body: formData,
    });
  });
});
