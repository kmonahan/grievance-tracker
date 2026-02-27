import { addGrievance } from "./actions";

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

function buildFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const defaults: Record<string, string> = {
    name: "Unsafe working conditions",
    description: "The break room has exposed wiring near the sink.",
    category_id: "3",
    point_person_id: "7",
    ...overrides,
  };
  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value);
  }
  return formData;
}

describe("addGrievance action", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  });

  it("calls POST /grievances/add with the submitted FormData", async () => {
    const formData = buildFormData();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 42 }),
    });

    await addGrievance(initialState, formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/add",
      expect.objectContaining({
        method: "POST",
        body: formData,
      }),
    );
  });

  it("sends the access token as an Authorization bearer header", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-secret-token" });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1 }),
    });

    await addGrievance(initialState, buildFormData());

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: "Bearer my-secret-token" },
      }),
    );
  });

  it("submits form data as FormData, not JSON", async () => {
    const formData = buildFormData();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1 }),
    });

    await addGrievance(initialState, formData);

    const callArgs = (fetch as jest.Mock).mock.calls[0][1];
    expect(callArgs.body).toBeInstanceOf(FormData);
    expect(callArgs.headers).not.toHaveProperty("Content-Type");
  });

  it("redirects to the new grievance page on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 99 }),
    });

    await addGrievance(initialState, buildFormData());

    expect(mockRedirect).toHaveBeenCalledWith("/grievances/99");
  });

  it("updates the grievances cache tag on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1 }),
    });

    await addGrievance(initialState, buildFormData());

    expect(mockUpdateTag).toHaveBeenCalledWith("grievances");
  });

  it("returns the general error message on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Name is required" }),
    });

    const result = await addGrievance(initialState, buildFormData());

    expect(result.error).toBe("Name is required");
  });

  it("returns field-specific errors on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Validation failed",
        errors: [
          { name: ["Name is required"] },
          { description: ["Description must be at least 10 characters"] },
        ],
      }),
    });

    const result = await addGrievance(initialState, buildFormData());

    expect(result.errors).toEqual([
      { name: ["Name is required"] },
      { description: ["Description must be at least 10 characters"] },
    ]);
  });

  it("returns a fallback error when the server provides no error message", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await addGrievance(initialState, buildFormData());

    expect(result.error).toBe("An error occurred. Please try again.");
  });

  it("does not redirect on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Name is required" }),
    });

    await addGrievance(initialState, buildFormData());

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("does not update cache tag on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Name is required" }),
    });

    await addGrievance(initialState, buildFormData());

    expect(mockUpdateTag).not.toHaveBeenCalled();
  });

  it("preserves submitted form field values on error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Name is required" }),
    });

    const formData = buildFormData({
      name: "My grievance",
      description: "Detailed description of the issue",
      category_id: "5",
      point_person_id: "12",
    });

    const result = await addGrievance(initialState, formData);

    expect(result.fields).toEqual({
      name: "My grievance",
      description: "Detailed description of the issue",
      category_id: "5",
      point_person_id: "12",
    });
  });

  it("returns null errors array when server provides no field-specific errors", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    const result = await addGrievance(initialState, buildFormData());

    expect(result.errors).toBeNull();
  });
});
