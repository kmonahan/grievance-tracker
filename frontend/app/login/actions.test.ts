import { login } from "./actions";

global.fetch = jest.fn();

describe("login action", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
  });

  it("returns error: null on a successful response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const result = await login({ error: null }, new FormData());

    expect(result).toEqual({ error: null });
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
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const formData = new FormData();

    await login({ error: null }, formData);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/login", {
      method: "POST",
      body: formData,
    });
  });
});
