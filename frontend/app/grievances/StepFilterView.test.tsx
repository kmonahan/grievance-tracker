import { fireEvent, render, screen } from "@testing-library/react";
import type { Grievance } from "~/app/grievances/types";
import { StepFilterView } from "./StepFilterView";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  usePathname: jest.fn(() => "/grievances"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const STEP_1_OPEN_GRIEVANCE: Grievance = {
  id: 1,
  name: "Unsafe Working Conditions",
  description: "Staff have reported inadequate ventilation.",
  category: "Health & Safety",
  point_person: "Maria Santos",
  escalations: [
    {
      id: 1,
      date: "2026-02-14",
      step: "Step #1",
      status: "Waiting to Schedule",
      date_due: "2026-04-18",
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const STEP_2_OPEN_GRIEVANCE: Grievance = {
  id: 2,
  name: "Denial of Bereavement Leave",
  description: "Member was denied bereavement leave.",
  category: "Leave",
  point_person: "James Okafor",
  escalations: [
    {
      id: 2,
      date: "2026-01-09",
      step: "Step #2",
      status: "Scheduled",
      date_due: "2026-04-22",
      hearing_date: "2026-04-10",
      deadline_missed: false,
      user: { id: 2, is_active: true, name: "Admin User" },
    },
  ],
};

const STEP_3_OPEN_GRIEVANCE: Grievance = {
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

const STEP_1_CLOSED_GRIEVANCE: Grievance = {
  id: 4,
  name: "Resolved Pay Dispute",
  description: "Pay dispute that was resolved.",
  category: "Pay",
  point_person: "Sam Lee",
  escalations: [
    {
      id: 4,
      date: "2025-11-01",
      step: "Step #1",
      status: "Resolved",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const STEP_2_CLOSED_GRIEVANCE: Grievance = {
  id: 5,
  name: "Denied Overtime Claim",
  description: "Overtime claim that was denied.",
  category: "Pay",
  point_person: "Alex Kim",
  escalations: [
    {
      id: 5,
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

function renderView(
  openGrievances: Grievance[],
  closedGrievances: Grievance[] = [],
  showClosed = false,
) {
  return render(
    <StepFilterView
      openGrievances={openGrievances}
      closedGrievances={closedGrievances}
      showClosed={showClosed}
    />,
  );
}

describe("StepFilterView", () => {
  it("renders the All filter button", () => {
    renderView([STEP_1_OPEN_GRIEVANCE]);
    expect(screen.getByRole("button", { name: /^all$/i })).toBeInTheDocument();
  });

  it("renders filter buttons for Step 1, Step 2, and Step 3", () => {
    renderView([STEP_1_OPEN_GRIEVANCE]);
    expect(screen.getByRole("button", { name: /step 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /step 2/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /step 3/i })).toBeInTheDocument();
  });

  it("shows all open grievances when no step filter is active", () => {
    renderView([STEP_1_OPEN_GRIEVANCE, STEP_2_OPEN_GRIEVANCE]);
    expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
    expect(screen.getByText("Denial of Bereavement Leave")).toBeInTheDocument();
  });

  it("shows only Step #1 grievances when Step 1 filter is active", () => {
    renderView([STEP_1_OPEN_GRIEVANCE, STEP_2_OPEN_GRIEVANCE]);
    fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
    expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
    expect(
      screen.queryByText("Denial of Bereavement Leave"),
    ).not.toBeInTheDocument();
  });

  it("shows only Step #2 grievances when Step 2 filter is active", () => {
    renderView([STEP_1_OPEN_GRIEVANCE, STEP_2_OPEN_GRIEVANCE]);
    fireEvent.click(screen.getByRole("button", { name: /step 2/i }));
    expect(
      screen.queryByText("Unsafe Working Conditions"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Denial of Bereavement Leave")).toBeInTheDocument();
  });

  it("shows only Step #3 grievances when Step 3 filter is active", () => {
    renderView([
      STEP_1_OPEN_GRIEVANCE,
      STEP_2_OPEN_GRIEVANCE,
      STEP_3_OPEN_GRIEVANCE,
    ]);
    fireEvent.click(screen.getByRole("button", { name: /step 3/i }));
    expect(
      screen.queryByText("Unsafe Working Conditions"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Denial of Bereavement Leave"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Seniority Violation")).toBeInTheDocument();
  });

  it("shows all grievances again after clicking All", () => {
    renderView([STEP_1_OPEN_GRIEVANCE, STEP_2_OPEN_GRIEVANCE]);
    fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
    fireEvent.click(screen.getByRole("button", { name: /^all$/i }));
    expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
    expect(screen.getByText("Denial of Bereavement Leave")).toBeInTheDocument();
  });

  it("marks the All button as pressed when no filter is active", () => {
    renderView([STEP_1_OPEN_GRIEVANCE]);
    expect(screen.getByRole("button", { name: /^all$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("marks the active step button as pressed", () => {
    renderView([STEP_1_OPEN_GRIEVANCE]);
    fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
    expect(screen.getByRole("button", { name: /step 1/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /^all$/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows 'No grievances at this step' when the filtered step has no open grievances", () => {
    renderView([STEP_1_OPEN_GRIEVANCE]);
    fireEvent.click(screen.getByRole("button", { name: /step 2/i }));
    expect(screen.getByText("No grievances at this step.")).toBeInTheDocument();
  });

  describe("with showClosed enabled", () => {
    it("does not show closed grievances when no step filter is active", () => {
      renderView([STEP_1_OPEN_GRIEVANCE], [STEP_1_CLOSED_GRIEVANCE], false);
      expect(
        screen.queryByText("Resolved Pay Dispute"),
      ).not.toBeInTheDocument();
    });

    it("shows closed grievances for the active step when showClosed is true", () => {
      renderView([STEP_1_OPEN_GRIEVANCE], [STEP_1_CLOSED_GRIEVANCE], true);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Resolved Pay Dispute")).toBeInTheDocument();
    });

    it("shows closed grievances when All filter is active and showClosed is true", () => {
      renderView([STEP_1_OPEN_GRIEVANCE], [STEP_1_CLOSED_GRIEVANCE], true);
      expect(screen.getByText("Resolved Pay Dispute")).toBeInTheDocument();
    });

    it("only shows closed grievances for the selected step, not other steps", () => {
      renderView(
        [STEP_1_OPEN_GRIEVANCE],
        [STEP_1_CLOSED_GRIEVANCE, STEP_2_CLOSED_GRIEVANCE],
        true,
      );
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Resolved Pay Dispute")).toBeInTheDocument();
      expect(
        screen.queryByText("Denied Overtime Claim"),
      ).not.toBeInTheDocument();
    });

    it("shows both open and closed grievances for the active step when showClosed is true", () => {
      renderView([STEP_1_OPEN_GRIEVANCE], [STEP_1_CLOSED_GRIEVANCE], true);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(screen.getByText("Resolved Pay Dispute")).toBeInTheDocument();
    });

    it("hides closed grievances for step when step filter is active and showClosed is false", () => {
      renderView([STEP_1_OPEN_GRIEVANCE], [STEP_1_CLOSED_GRIEVANCE], false);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.queryByText("Resolved Pay Dispute"),
      ).not.toBeInTheDocument();
    });
  });
});
