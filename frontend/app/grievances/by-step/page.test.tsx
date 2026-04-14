import { render, screen } from "@testing-library/react";
import type { Grievance } from "~/app/grievances/types";
import GrievancesByStepPage from "./page";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  usePathname: jest.fn(() => "/grievances/by-step"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const STEP_1_GRIEVANCE: Grievance = {
  id: 1,
  name: "Unauthorized Schedule Change",
  description: "Member was moved off preferred shift without proper notice.",
  category: "Scheduling",
  point_person: "Alex Rivera",
  escalations: [
    {
      id: 1,
      date: "2026-03-15",
      step: "Step #1",
      status: "Waiting to Schedule",
      date_due: "2026-04-20",
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Alex Rivera" },
    },
  ],
};

const STEP_2_GRIEVANCE: Grievance = {
  id: 2,
  name: "Denied Bereavement Leave",
  description: "Member was denied bereavement leave for a sibling's passing.",
  category: "Leave",
  point_person: "Sam Chen",
  escalations: [
    {
      id: 2,
      date: "2026-03-20",
      step: "Step #2",
      status: "Scheduled",
      date_due: "2026-04-25",
      hearing_date: "2026-04-18",
      deadline_missed: false,
      user: { id: 2, is_active: true, name: "Sam Chen" },
    },
  ],
};

const STEP_3_GRIEVANCE: Grievance = {
  id: 3,
  name: "Seniority Violation",
  description: "Overtime distributed out of seniority order.",
  category: "Scheduling",
  point_person: "Jordan Lee",
  escalations: [
    {
      id: 3,
      date: "2026-03-05",
      step: "Step #3",
      status: "Waiting on Decision",
      date_due: "2026-04-10",
      hearing_date: "2026-03-20",
      deadline_missed: false,
      user: { id: 3, is_active: true, name: "Jordan Lee" },
    },
  ],
};

const RESOLVED_STEP_1_GRIEVANCE: Grievance = {
  id: 4,
  name: "Resolved Scheduling Dispute",
  description: "Resolved scheduling dispute.",
  category: "Scheduling",
  point_person: "Alex Rivera",
  escalations: [
    {
      id: 4,
      date: "2026-01-10",
      step: "Step #1",
      status: "Resolved",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Alex Rivera" },
    },
  ],
};

function mockFetchForSteps(
  step1: Grievance[],
  step2: Grievance[],
  step3: Grievance[],
) {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grievances: step1 }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grievances: step2 }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grievances: step3 }),
    });
}

async function renderPage() {
  const jsx = await GrievancesByStepPage();
  return render(jsx);
}

describe("GrievancesByStepPage", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
    jest.clearAllMocks();
    mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  });

  it("fetches from /grievances/step/ONE with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchForSteps([STEP_1_GRIEVANCE], [], []);
    await GrievancesByStepPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/step/ONE",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("fetches from /grievances/step/TWO with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchForSteps([], [STEP_2_GRIEVANCE], []);
    await GrievancesByStepPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/step/TWO",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("fetches from /grievances/step/THREE with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchForSteps([], [], [STEP_3_GRIEVANCE]);
    await GrievancesByStepPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/grievances/step/THREE",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("renders the page heading", async () => {
    mockFetchForSteps([], [], []);
    await renderPage();
    expect(
      screen.getByRole("heading", { name: "By Step" }),
    ).toBeInTheDocument();
  });

  it("renders a link to add a new grievance", async () => {
    mockFetchForSteps([], [], []);
    await renderPage();
    const addLink = screen.getByRole("link", { name: /add grievance/i });
    expect(addLink).toBeInTheDocument();
    expect(addLink).toHaveAttribute("href", "/grievances/create");
  });

  it("renders step sections for Step #1, Step #2, and Step #3", async () => {
    mockFetchForSteps([], [], []);
    await renderPage();
    expect(screen.getByRole("region", { name: "Step #1" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Step #2" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Step #3" })).toBeInTheDocument();
  });

  it("shows the count of grievances for Step #1", async () => {
    mockFetchForSteps([STEP_1_GRIEVANCE], [], []);
    await renderPage();
    const step1Section = screen.getByRole("region", { name: "Step #1" });
    expect(step1Section).toHaveTextContent("1");
  });

  it("shows the count of grievances for Step #2", async () => {
    mockFetchForSteps([], [STEP_2_GRIEVANCE], []);
    await renderPage();
    const step2Section = screen.getByRole("region", { name: "Step #2" });
    expect(step2Section).toHaveTextContent("1");
  });

  it("shows the count of grievances for Step #3", async () => {
    mockFetchForSteps([], [], [STEP_3_GRIEVANCE]);
    await renderPage();
    const step3Section = screen.getByRole("region", { name: "Step #3" });
    expect(step3Section).toHaveTextContent("1");
  });

  it("shows a count of 0 when a step has no grievances", async () => {
    mockFetchForSteps([STEP_1_GRIEVANCE], [], []);
    await renderPage();
    const step2Section = screen.getByRole("region", { name: "Step #2" });
    expect(step2Section).toHaveTextContent("0");
  });

  it("renders the grievance name in the Step #1 section", async () => {
    mockFetchForSteps([STEP_1_GRIEVANCE], [], []);
    await renderPage();
    expect(
      screen.getByText("Unauthorized Schedule Change"),
    ).toBeInTheDocument();
  });

  it("renders the grievance name in the Step #2 section", async () => {
    mockFetchForSteps([], [STEP_2_GRIEVANCE], []);
    await renderPage();
    expect(screen.getByText("Denied Bereavement Leave")).toBeInTheDocument();
  });

  it("renders the grievance name in the Step #3 section", async () => {
    mockFetchForSteps([], [], [STEP_3_GRIEVANCE]);
    await renderPage();
    expect(screen.getByText("Seniority Violation")).toBeInTheDocument();
  });

  it("shows 'No grievances at this step' when Step #1 is empty", async () => {
    mockFetchForSteps([], [STEP_2_GRIEVANCE], []);
    await renderPage();
    const step1Section = screen.getByRole("region", { name: "Step #1" });
    expect(step1Section).toHaveTextContent("No grievances at this step.");
  });

  it("shows 'No grievances at this step' when Step #2 is empty", async () => {
    mockFetchForSteps([STEP_1_GRIEVANCE], [], []);
    await renderPage();
    const step2Section = screen.getByRole("region", { name: "Step #2" });
    expect(step2Section).toHaveTextContent("No grievances at this step.");
  });

  it("shows 'No grievances at this step' when Step #3 is empty", async () => {
    mockFetchForSteps([STEP_1_GRIEVANCE], [], []);
    await renderPage();
    const step3Section = screen.getByRole("region", { name: "Step #3" });
    expect(step3Section).toHaveTextContent("No grievances at this step.");
  });

  it("shows 'No grievances at this step' for all steps when all are empty", async () => {
    mockFetchForSteps([], [], []);
    await renderPage();
    const emptyMessages = screen.getAllByText("No grievances at this step.");
    expect(emptyMessages).toHaveLength(3);
  });

  it("renders grievances with a resolved status without filtering them out", async () => {
    mockFetchForSteps([RESOLVED_STEP_1_GRIEVANCE], [], []);
    await renderPage();
    expect(screen.getByText("Resolved Scheduling Dispute")).toBeInTheDocument();
  });

  it("renders multiple grievances in Step #1", async () => {
    const secondStep1Grievance: Grievance = {
      ...STEP_1_GRIEVANCE,
      id: 10,
      name: "Second Step 1 Grievance",
    };
    mockFetchForSteps([STEP_1_GRIEVANCE, secondStep1Grievance], [], []);
    await renderPage();
    expect(
      screen.getByText("Unauthorized Schedule Change"),
    ).toBeInTheDocument();
    expect(screen.getByText("Second Step 1 Grievance")).toBeInTheDocument();
    const step1Section = screen.getByRole("region", { name: "Step #1" });
    expect(step1Section).toHaveTextContent("2");
  });

  it("renders grievances across all steps simultaneously", async () => {
    mockFetchForSteps(
      [STEP_1_GRIEVANCE],
      [STEP_2_GRIEVANCE],
      [STEP_3_GRIEVANCE],
    );
    await renderPage();
    expect(
      screen.getByText("Unauthorized Schedule Change"),
    ).toBeInTheDocument();
    expect(screen.getByText("Denied Bereavement Leave")).toBeInTheDocument();
    expect(screen.getByText("Seniority Violation")).toBeInTheDocument();
  });
});
