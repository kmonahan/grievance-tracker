import { render, screen } from "@testing-library/react";
import type { Escalation, Grievance } from "~/app/grievances/types";
import Home, { type RecentActivity } from "./page";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const UPCOMING_GRIEVANCE: Grievance = {
  id: 1,
  name: "Test Grievance",
  date: "2025-12-19",
  description: "Test description",
  category: "Pay",
  point_person: "Walter Reuther",
  escalations: [],
};

const RECENT_ACTIVITY: RecentActivity = {
  id: 1,
  date: "2025-12-19",
  step: "Step #1",
  status: "Waiting to Schedule",
  date_due: "2026-01-02",
  hearing_date: null,
  deadline_missed: false,
  user: { id: 1, is_active: true, name: "Walter Reuther" },
  grievance: "Test Grievance",
  grievance_id: 1,
} as Escalation & { grievance: string; grievance_id: number };

function mockFetchSequence({
  upcoming = [],
  recent = [],
  yearTotal = 0,
}: {
  upcoming?: Grievance[];
  recent?: RecentActivity[];
  yearTotal?: number;
}) {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grievances: upcoming }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => recent,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ year_total: yearTotal }),
    });
}

async function renderHome(
  options: Parameters<typeof mockFetchSequence>[0] = {},
) {
  mockFetchSequence(options);
  const jsx = await Home();
  return render(jsx);
}

describe("Home", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  });

  it("renders the year total heading with the current year", async () => {
    await renderHome({ yearTotal: 5 });
    expect(
      screen.getByRole("heading", {
        name: `Grievances Filed in ${new Date().getFullYear()}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders the year total count", async () => {
    await renderHome({ yearTotal: 42 });
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders a year total of zero", async () => {
    await renderHome({ yearTotal: 0 });
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("fetches the year total from the backend with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    await renderHome({ yearTotal: 7 });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/year-total",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("renders upcoming grievances when present", async () => {
    await renderHome({ upcoming: [UPCOMING_GRIEVANCE], yearTotal: 1 });
    expect(screen.getByText("Test Grievance")).toBeInTheDocument();
  });

  it("renders a message when there are no upcoming deadlines", async () => {
    await renderHome({ upcoming: [], yearTotal: 0 });
    expect(screen.getByText("No upcoming deadlines")).toBeInTheDocument();
  });

  it("renders recent activity when present", async () => {
    await renderHome({ recent: [RECENT_ACTIVITY], yearTotal: 0 });
    expect(screen.getAllByText("Test Grievance").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("renders a message when there is no recent activity", async () => {
    await renderHome({ recent: [], yearTotal: 0 });
    expect(screen.getByText("No recent activity")).toBeInTheDocument();
  });
});
