import { escalateGrievance } from "./escalateAction";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const mockUpdateTag = jest.fn();
jest.mock("next/cache", () => ({
  updateTag: (tag: string) => mockUpdateTag(tag),
}));

const initialState = { error: null };

function buildFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const defaults: Record<string, string> = {
    grievance_id: "1",
    step: "ONE",
    status: "SCHEDULED",
    hearing_date: "2026-05-01",
    ...overrides,
  };
  for (const [key, value] of Object.entries(defaults)) {
    formData.set(key, value);
  }
  return formData;
}

describe("escalateGrievance action", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "access_token") return { value: "test-access-token" };
      if (name === "user_id") return { value: "7" };
      return undefined;
    });
  });

  it("calls POST /grievances/escalate/<id>", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(
      initialState,
      buildFormData({ grievance_id: "42" }),
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/escalate/42",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends step and status as backend enum keys in a JSON body", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(
      initialState,
      buildFormData({ step: "TWO", status: "WAITING_ON_DECISION" }),
    );

    const callBody = JSON.parse(
      (fetch as jest.Mock).mock.calls[0][1].body as string,
    );
    expect(callBody.step).toBe("TWO");
    expect(callBody.status).toBe("WAITING_ON_DECISION");
  });

  it("sends user_id from the user_id cookie in the request body", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "access_token") return { value: "token" };
      if (name === "user_id") return { value: "42" };
      return undefined;
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(initialState, buildFormData());

    const callBody = JSON.parse(
      (fetch as jest.Mock).mock.calls[0][1].body as string,
    );
    expect(callBody.user_id).toBe(42);
  });

  it("sends the access token as an Authorization bearer header", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "access_token") return { value: "my-secret-token" };
      if (name === "user_id") return { value: "1" };
      return undefined;
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(initialState, buildFormData());

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-secret-token",
        }),
      }),
    );
  });

  it("sends Content-Type: application/json header", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(initialState, buildFormData());

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("includes hearing_date in the body when escalating to Scheduled", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(
      initialState,
      buildFormData({ status: "SCHEDULED", hearing_date: "2026-06-15" }),
    );

    const callBody = JSON.parse(
      (fetch as jest.Mock).mock.calls[0][1].body as string,
    );
    expect(callBody.hearing_date).toBe("2026-06-15");
  });

  it("omits hearing_date from the body when not escalating to Scheduled", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(
      initialState,
      buildFormData({ status: "WAITING_TO_FILE", hearing_date: "" }),
    );

    const callBody = JSON.parse(
      (fetch as jest.Mock).mock.calls[0][1].body as string,
    );
    expect(callBody).not.toHaveProperty("hearing_date");
  });

  it("invalidates the grievances cache tag on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    await escalateGrievance(initialState, buildFormData());

    expect(mockUpdateTag).toHaveBeenCalledWith("grievances");
  });

  it("returns null error on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, escalations: [] }),
    });

    const result = await escalateGrievance(initialState, buildFormData());

    expect(result.error).toBeNull();
  });

  it("returns the server error message on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Missing or invalid step or status" }),
    });

    const result = await escalateGrievance(initialState, buildFormData());

    expect(result.error).toBe("Missing or invalid step or status");
  });

  it("returns a fallback error message when the server provides none", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await escalateGrievance(initialState, buildFormData());

    expect(result.error).toBe("An error occurred. Please try again.");
  });

  it("does not invalidate cache on a failed response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Missing or invalid step or status" }),
    });

    await escalateGrievance(initialState, buildFormData());

    expect(mockUpdateTag).not.toHaveBeenCalled();
  });
});
