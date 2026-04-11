import { render, screen } from "@testing-library/react";
import type { Grievance } from "~/app/grievances/types";
import GrievancesPage from "./page";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const OPEN_GRIEVANCE: Grievance = {
  id: 1,
  name: "Unsafe Working Conditions",
  description: "Staff have reported inadequate ventilation.",
  category: "Health & Safety",
  point_person: "Maria Santos",
  escalations: [
    {
      id: 1,
      date: "2026-02-14",
      step: "Step #2",
      status: "Waiting on Decision",
      date_due: "2026-04-18",
      hearing_date: "2026-03-28",
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const SCHEDULED_GRIEVANCE: Grievance = {
  id: 2,
  name: "Denial of Bereavement Leave",
  description: "Member was denied bereavement leave.",
  category: "Leave",
  point_person: "James Okafor",
  escalations: [
    {
      id: 2,
      date: "2026-01-09",
      step: "Step #1",
      status: "Scheduled",
      date_due: "2026-04-22",
      hearing_date: null,
      deadline_missed: false,
      user: { id: 2, is_active: true, name: "Admin User" },
    },
  ],
};

const RESOLVED_GRIEVANCE: Grievance = {
  id: 3,
  name: "Resolved Pay Dispute",
  description: "Pay dispute that was resolved.",
  category: "Pay",
  point_person: "Sam Lee",
  escalations: [
    {
      id: 3,
      date: "2025-11-01",
      step: "Step #3",
      status: "Resolved",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const DENIED_GRIEVANCE: Grievance = {
  id: 4,
  name: "Denied Overtime Claim",
  description: "Overtime claim that was denied.",
  category: "Pay",
  point_person: "Alex Kim",
  escalations: [
    {
      id: 4,
      date: "2025-10-15",
      step: "Step #2",
      status: "Denied",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const WITHDRAWN_GRIEVANCE: Grievance = {
  id: 5,
  name: "Withdrawn Scheduling Dispute",
  description: "Scheduling dispute that was withdrawn.",
  category: "Scheduling",
  point_person: "Pat Brown",
  escalations: [
    {
      id: 5,
      date: "2025-09-20",
      step: "Step #1",
      status: "Withdrawn",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const NO_ESCALATIONS_GRIEVANCE: Grievance = {
  id: 6,
  name: "New Unescalated Grievance",
  description: "A brand new grievance with no escalations yet.",
  category: "Workload",
  point_person: "Dana White",
  escalations: [],
};

function mockFetchWithGrievances(grievances: Grievance[]) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ grievances }),
  });
}

async function renderPage() {
  const jsx = await GrievancesPage();
  return render(jsx);
}

describe("GrievancesPage", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  });

  it("fetches from /grievances/all with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await GrievancesPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/all",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("renders the page heading", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(
      screen.getByRole("heading", { name: "All Grievances" }),
    ).toBeInTheDocument();
  });

  it("renders a link to add a new grievance", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    const addLink = screen.getByRole("link", { name: /add grievance/i });
    expect(addLink).toBeInTheDocument();
    expect(addLink).toHaveAttribute("href", "/grievances/create");
  });

  it("renders the open grievance count in the subtitle", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE, SCHEDULED_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("2 open grievances")).toBeInTheDocument();
  });

  it("uses singular 'grievance' when count is 1", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("1 open grievance")).toBeInTheDocument();
  });

  it("renders a card for each open grievance", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE, SCHEDULED_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
    expect(screen.getByText("Denial of Bereavement Leave")).toBeInTheDocument();
  });

  it("links each grievance card to the detail page", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    const link = screen.getByRole("link", {
      name: /unsafe working conditions/i,
    });
    expect(link).toHaveAttribute("href", "/grievances/1");
  });

  it("renders the category badge on each card", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("Health & Safety")).toBeInTheDocument();
  });

  it("renders the escalation step on each card", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("Step #2")).toBeInTheDocument();
  });

  it("renders the status tag on each card", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("Waiting on Decision")).toBeInTheDocument();
  });

  it("renders the point person name on each card", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
  });

  it("renders the due date when present", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText(/Apr 18, 2026/)).toBeInTheDocument();
  });

  it("renders 'No deadline' when date_due is null", async () => {
    mockFetchWithGrievances([SCHEDULED_GRIEVANCE]);
    await renderPage();
    // SCHEDULED_GRIEVANCE has a due date; use a grievance without one
    const noDueDateGrievance: Grievance = {
      ...OPEN_GRIEVANCE,
      id: 99,
      escalations: [
        {
          ...OPEN_GRIEVANCE.escalations[0],
          date_due: null,
        },
      ],
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grievances: [noDueDateGrievance] }),
    });
    await renderPage();
    expect(screen.getByText("No deadline")).toBeInTheDocument();
  });

  it("filters out grievances with a terminal status of Resolved", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE, RESOLVED_GRIEVANCE]);
    await renderPage();
    expect(screen.queryByText("Resolved Pay Dispute")).not.toBeInTheDocument();
    expect(screen.getByText("1 open grievance")).toBeInTheDocument();
  });

  it("filters out grievances with a terminal status of Denied", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE, DENIED_GRIEVANCE]);
    await renderPage();
    expect(screen.queryByText("Denied Overtime Claim")).not.toBeInTheDocument();
    expect(screen.getByText("1 open grievance")).toBeInTheDocument();
  });

  it("filters out grievances with a terminal status of Withdrawn", async () => {
    mockFetchWithGrievances([OPEN_GRIEVANCE, WITHDRAWN_GRIEVANCE]);
    await renderPage();
    expect(
      screen.queryByText("Withdrawn Scheduling Dispute"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("1 open grievance")).toBeInTheDocument();
  });

  it("includes grievances with no escalations as open", async () => {
    mockFetchWithGrievances([NO_ESCALATIONS_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("New Unescalated Grievance")).toBeInTheDocument();
    expect(screen.getByText("1 open grievance")).toBeInTheDocument();
  });

  it("hides step/status/due-date when grievance has no escalations", async () => {
    mockFetchWithGrievances([NO_ESCALATIONS_GRIEVANCE]);
    await renderPage();
    expect(screen.queryByText(/Step #/)).not.toBeInTheDocument();
    expect(screen.queryByText("No deadline")).not.toBeInTheDocument();
  });

  it("shows the empty state when all grievances are terminal", async () => {
    mockFetchWithGrievances([
      RESOLVED_GRIEVANCE,
      DENIED_GRIEVANCE,
      WITHDRAWN_GRIEVANCE,
    ]);
    await renderPage();
    expect(screen.getByText("No open grievances")).toBeInTheDocument();
    expect(screen.getByText("0 open grievances")).toBeInTheDocument();
  });

  it("shows the empty state when there are no grievances at all", async () => {
    mockFetchWithGrievances([]);
    await renderPage();
    expect(screen.getByText("No open grievances")).toBeInTheDocument();
  });
});
