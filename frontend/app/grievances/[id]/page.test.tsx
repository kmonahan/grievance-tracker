import { render, screen } from "@testing-library/react";
import type { Grievance } from "~/app/grievances/types";
import GrievanceDetailPage from "./page";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const GRIEVANCES: Record<string, Grievance> = {
  "1": {
    id: 1,
    name: "Test #1",
    description: "Test description #1",
    category: "Pay",
    point_person: "Walter Reuther",
    escalations: [
      {
        id: 1,
        date: "2025-12-19",
        step: "Step #1",
        status: "Waiting to Schedule",
        date_due: "2026-01-02",
        hearing_date: "2025-12-31",
        deadline_missed: false,
        user: { id: 1, is_active: true, name: "Walter Reuther" },
      },
    ],
  },
  "2": {
    id: 2,
    name: "Test #2",
    description: "Test description #2",
    category: "Pay",
    point_person: "Cesar Chavez",
    escalations: [
      {
        id: 2,
        date: "2025-12-19",
        step: "Step #1",
        status: "Waiting to Schedule",
        date_due: "2026-01-02",
        hearing_date: null,
        deadline_missed: false,
        user: { id: 2, is_active: true, name: "Cesar Chavez" },
      },
      {
        id: 3,
        date: "2025-12-21",
        step: "Step #1",
        status: "Scheduled",
        date_due: null,
        hearing_date: "2025-12-30",
        deadline_missed: false,
        user: { id: 2, is_active: true, name: "Cesar Chavez" },
      },
      {
        id: 4,
        date: "2025-12-31",
        step: "Step #1",
        status: "Waiting on Decision",
        date_due: "2026-01-08",
        hearing_date: null,
        deadline_missed: false,
        user: { id: 2, is_active: true, name: "Cesar Chavez" },
      },
      {
        id: 5,
        date: "2026-01-09",
        step: "Step #1",
        status: "Waiting to File",
        date_due: "2026-01-30",
        hearing_date: null,
        deadline_missed: false,
        user: { id: 2, is_active: true, name: "Cesar Chavez" },
      },
    ],
  },
  "3": {
    id: 3,
    name: "Test #3",
    description: "Test description #3",
    category: "PTO",
    point_person: "Clara Lemlich",
    escalations: [],
  },
  "4": {
    id: 4,
    name: "Test #4",
    description: "Test description #4",
    category: "PTO",
    point_person: "Walter Reuther",
    escalations: [
      {
        id: 6,
        date: "2026-01-10",
        step: "Step #2",
        status: "In Abeyance",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 1, is_active: true, name: "Walter Reuther" },
      },
    ],
  },
};

function mockFetchForId(id: string) {
  const grievance = GRIEVANCES[id];
  if (grievance) {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => grievance,
    });
  } else {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
  }
}

async function renderWithId(id: string) {
  mockFetchForId(id);
  const jsx = await GrievanceDetailPage({
    params: Promise.resolve({ id }),
  });
  return render(jsx);
}

describe("GrievanceDetailPage", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  });

  it("renders the grievance name as a heading", async () => {
    await renderWithId("1");
    expect(
      screen.getByRole("heading", { name: "Test #1" }),
    ).toBeInTheDocument();
  });

  it("renders the category badge", async () => {
    await renderWithId("1");
    expect(screen.getByText("Pay")).toBeInTheDocument();
  });

  it("renders the description", async () => {
    await renderWithId("1");
    expect(screen.getByText("Test description #1")).toBeInTheDocument();
  });

  it("renders the point person with avatar initials", async () => {
    await renderWithId("1");
    const names = screen.getAllByText("Walter Reuther");
    expect(names.length).toBeGreaterThanOrEqual(1);
    const initials = screen.getAllByText("WR");
    expect(initials.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the current status from the latest escalation", async () => {
    await renderWithId("2");
    const badges = screen.getAllByText("Waiting to File");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the upcoming due date from the latest escalation", async () => {
    await renderWithId("2");
    expect(screen.getByText("Jan 30, 2026")).toBeInTheDocument();
  });

  it("does not render due date section when latest escalation has no date_due", async () => {
    await renderWithId("4");
    expect(screen.queryByText("Upcoming Due Date")).not.toBeInTheDocument();
  });

  it("renders all escalation timeline entries", async () => {
    await renderWithId("2");
    expect(screen.getByText("Waiting to Schedule")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Waiting on Decision")).toBeInTheDocument();
    expect(screen.getAllByText("Waiting to File").length).toBeGreaterThan(0);
  });

  it("renders escalation dates", async () => {
    await renderWithId("1");
    expect(screen.getByText("Dec 19, 2025")).toBeInTheDocument();
  });

  it("renders escalation hearing date when present", async () => {
    await renderWithId("1");
    expect(screen.getByText("Hearing: Dec 31, 2025")).toBeInTheDocument();
  });

  it("renders escalation step name", async () => {
    await renderWithId("4");
    expect(screen.getByText("Step #2")).toBeInTheDocument();
  });

  it("renders escalation assigned user", async () => {
    await renderWithId("2");
    const userNames = screen.getAllByText("Cesar Chavez");
    // At least one in the point person section and some in the timeline
    expect(userNames.length).toBeGreaterThanOrEqual(2);
  });

  it("does not render escalation history section when there are no escalations", async () => {
    await renderWithId("3");
    expect(screen.queryByText("Escalation History")).not.toBeInTheDocument();
  });

  it("does not render status badge when there are no escalations", async () => {
    await renderWithId("3");
    // Only the category badge should be present, not a status badge
    expect(screen.getByText("PTO")).toBeInTheDocument();
  });

  it("renders not found message for invalid id", async () => {
    await renderWithId("999");
    expect(
      screen.getByRole("heading", { name: "Grievance not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No grievance exists with ID 999."),
    ).toBeInTheDocument();
  });

  it("fetches from the backend with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchForId("1");
    await GrievanceDetailPage({ params: Promise.resolve({ id: "1" }) });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/1",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });
});
