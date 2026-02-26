import { register } from "./actions";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (path: string) => mockRedirect(path),
}));

const mockUpdateTag = jest.fn();
jest.mock("next/cache", () => ({
  updateTag: (tag: string) => mockUpdateTag(tag),
}));

const initialState = { error: null, errors: null, fields: {} };

describe("register action", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  });

  it("calls the correct endpoint with POST, FormData, and Authorization header", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({}),
    });
    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "securepassword");
    formData.set("confirm", "securepassword");

    await register(initialState, formData);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/register", {
      method: "POST",
      body: formData,
      headers: { Authorization: "Bearer test-access-token" },
    });
  });

  it("updates the users cache tag on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({}),
    });

    await register(initialState, new FormData());

    expect(mockUpdateTag).toHaveBeenCalledWith("users");
  });

  it("redirects to the homepage on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({}),
    });

    await register(initialState, new FormData());

    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("returns the general error message on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already registered" }),
    });

    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "securepassword");
    formData.set("confirm", "securepassword");

    const result = await register(initialState, formData);

    expect(result.error).toBe("Email already registered");
  });

  it("returns field-specific errors on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        errors: [
          {
            password: [
              "Password must be at least 12 characters",
              "Passwords must match",
            ],
          },
        ],
      }),
    });

    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "short");
    formData.set("confirm", "short");

    const result = await register(initialState, formData);

    expect(result.errors).toEqual([
      {
        password: [
          "Password must be at least 12 characters",
          "Passwords must match",
        ],
      },
    ]);
  });

  it("returns a fallback error when the server provides no error message", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await register(initialState, new FormData());

    expect(result.error).toBe("An error occurred. Please try again.");
  });

  it("does not redirect on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already registered" }),
    });

    await register(initialState, new FormData());

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("does not update cache tag on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already registered" }),
    });

    await register(initialState, new FormData());

    expect(mockUpdateTag).not.toHaveBeenCalled();
  });

  it("preserves submitted form field values on error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already registered" }),
    });

    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "securepassword");
    formData.set("confirm", "securepassword");

    const result = await register(initialState, formData);

    expect(result.fields).toEqual({
      name: "Test User",
      email: "test@example.com",
      password: "securepassword",
      confirm: "securepassword",
    });
  });
});
