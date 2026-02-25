import { addCategory } from "./actions";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const mockRevalidateTag = jest.fn();
jest.mock("next/cache", () => ({
  revalidateTag: (tag: string) => mockRevalidateTag(tag),
}));

describe("addCategory action", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
    jest.clearAllMocks();
  });

  it("calls the correct endpoint with POST and the submitted FormData", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Safety" }),
    });

    const formData = new FormData();
    await addCategory({ error: null, success: false }, formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/categories/add",
      expect.objectContaining({
        method: "POST",
        body: formData,
      }),
    );
  });

  it("forwards access_token as Authorization header", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    await addCategory({ error: null, success: false }, new FormData());

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("calls revalidateTag('categories') on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 5 }),
    });

    await addCategory({ error: null, success: false }, new FormData());

    expect(mockRevalidateTag).toHaveBeenCalledWith("categories");
  });

  it("returns success state with category data on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 42, name: "Safety" }),
    });

    const result = await addCategory(
      { error: null, success: false },
      new FormData(),
    );

    expect(result).toEqual({
      error: null,
      success: true,
      category: { id: 42, name: "Safety" },
    });
  });

  it("returns error state on failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Name already taken" }),
    });

    const result = await addCategory(
      { error: null, success: false },
      new FormData(),
    );

    expect(result).toEqual({ error: "Name already taken", success: false });
  });

  it("returns fallback error when server provides no error message", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await addCategory(
      { error: null, success: false },
      new FormData(),
    );

    expect(result).toEqual({
      error: "An error occurred. Please try again.",
      success: false,
    });
  });
});
