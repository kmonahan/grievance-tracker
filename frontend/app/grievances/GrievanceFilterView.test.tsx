import { fireEvent, render, screen } from "@testing-library/react";
import type { Grievance } from "~/app/grievances/types";
import { GrievanceFilterView } from "./GrievanceFilterView";

// Fix the current year for predictable tests
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_YEAR_DATE = `${CURRENT_YEAR}-03-01`;
const LAST_YEAR_DATE = `${CURRENT_YEAR - 1}-03-01`;

const STEP_1_OPEN: Grievance = {
  id: 1,
  name: "Unsafe Working Conditions",
  description: "Staff have reported inadequate ventilation.",
  category: "Health & Safety",
  point_person: "Maria Santos",
  escalations: [
    {
      id: 1,
      date: CURRENT_YEAR_DATE,
      step: "Step #1",
      status: "Waiting to Schedule",
      date_due: "2026-04-18",
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const STEP_2_OPEN: Grievance = {
  id: 2,
  name: "Denial of Bereavement Leave",
  description: "Member was denied bereavement leave.",
  category: "Leave",
  point_person: "James Okafor",
  escalations: [
    {
      id: 2,
      date: CURRENT_YEAR_DATE,
      step: "Step #2",
      status: "Scheduled",
      date_due: "2026-04-22",
      hearing_date: "2026-04-10",
      deadline_missed: false,
      user: { id: 2, is_active: true, name: "Admin User" },
    },
  ],
};

const STEP_3_OPEN: Grievance = {
  id: 3,
  name: "Seniority Violation",
  description: "Overtime distributed out of seniority order.",
  category: "Scheduling",
  point_person: "Jordan Lee",
  escalations: [
    {
      id: 3,
      date: CURRENT_YEAR_DATE,
      step: "Step #3",
      status: "Waiting on Decision",
      date_due: "2026-04-10",
      hearing_date: "2026-03-20",
      deadline_missed: false,
      user: { id: 3, is_active: true, name: "Jordan Lee" },
    },
  ],
};

const STEP_1_CLOSED: Grievance = {
  id: 4,
  name: "Resolved Pay Dispute",
  description: "Pay dispute that was resolved.",
  category: "Pay",
  point_person: "Sam Lee",
  escalations: [
    {
      id: 4,
      date: LAST_YEAR_DATE,
      step: "Step #1",
      status: "Resolved",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const STEP_2_CLOSED: Grievance = {
  id: 5,
  name: "Denied Overtime Claim",
  description: "Overtime claim that was denied.",
  category: "Pay",
  point_person: "Alex Kim",
  escalations: [
    {
      id: 5,
      date: LAST_YEAR_DATE,
      step: "Step #2",
      status: "Denied",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const MISSED_DEADLINE_OPEN: Grievance = {
  id: 6,
  name: "Missed Deadline Grievance",
  description: "A grievance with a missed deadline.",
  category: "Workload",
  point_person: "Pat Brown",
  escalations: [
    {
      id: 6,
      date: CURRENT_YEAR_DATE,
      step: "Step #1",
      status: "Waiting to Schedule",
      date_due: "2026-02-01",
      hearing_date: null,
      deadline_missed: true,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

const LAST_YEAR_OPEN: Grievance = {
  id: 7,
  name: "Last Year Grievance",
  description: "Filed last year.",
  category: "Leave",
  point_person: "Dana White",
  escalations: [
    {
      id: 7,
      date: LAST_YEAR_DATE,
      step: "Step #1",
      status: "Waiting to Schedule",
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Admin User" },
    },
  ],
};

function renderView(grievances: Grievance[]) {
  return render(<GrievanceFilterView grievances={grievances} />);
}

describe("GrievanceFilterView", () => {
  describe("step filter", () => {
    it("renders Step 1, Step 2, and Step 3 buttons (no All button)", () => {
      renderView([STEP_1_OPEN]);
      expect(
        screen.queryByRole("button", { name: /^all$/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /step 1/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /step 2/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /step 3/i }),
      ).toBeInTheDocument();
    });

    it("shows all open grievances with no step filter active", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.getByText("Denial of Bereavement Leave"),
      ).toBeInTheDocument();
    });

    it("filters to Step 1 grievances when Step 1 is selected", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.queryByText("Denial of Bereavement Leave"),
      ).not.toBeInTheDocument();
    });

    it("filters to Step 2 grievances when Step 2 is selected", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 2/i }));
      expect(
        screen.queryByText("Unsafe Working Conditions"),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("Denial of Bereavement Leave"),
      ).toBeInTheDocument();
    });

    it("filters to Step 3 grievances when Step 3 is selected", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN, STEP_3_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 3/i }));
      expect(
        screen.queryByText("Unsafe Working Conditions"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Denial of Bereavement Leave"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Seniority Violation")).toBeInTheDocument();
    });

    it("deselects the step filter when the active step is clicked again", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.getByText("Denial of Bereavement Leave"),
      ).toBeInTheDocument();
    });

    it("marks the active step button as pressed", () => {
      renderView([STEP_1_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByRole("button", { name: /step 1/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: /step 2/i })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  });

  describe("category filter", () => {
    it("renders a button for each unique category in the grievances", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      expect(
        screen.getByRole("button", { name: "Health & Safety" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Leave" })).toBeInTheDocument();
    });

    it("filters grievances to the selected category", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: "Health & Safety" }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.queryByText("Denial of Bereavement Leave"),
      ).not.toBeInTheDocument();
    });

    it("deselects the category when clicked again", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: "Health & Safety" }));
      fireEvent.click(screen.getByRole("button", { name: "Health & Safety" }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.getByText("Denial of Bereavement Leave"),
      ).toBeInTheDocument();
    });

    it("marks the active category button as pressed", () => {
      renderView([STEP_1_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: "Health & Safety" }));
      expect(
        screen.getByRole("button", { name: "Health & Safety" }),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("current year filter", () => {
    it("shows all grievances when the current year filter is off", () => {
      renderView([STEP_1_OPEN, LAST_YEAR_OPEN]);
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(screen.getByText("Last Year Grievance")).toBeInTheDocument();
    });

    it("hides grievances filed before the current year when the filter is on", () => {
      renderView([STEP_1_OPEN, LAST_YEAR_OPEN]);
      fireEvent.click(
        screen.getByRole("switch", {
          name: new RegExp(`${CURRENT_YEAR} only`),
        }),
      );
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(screen.queryByText("Last Year Grievance")).not.toBeInTheDocument();
    });
  });

  describe("missed deadline filter", () => {
    it("shows all grievances when the missed deadline filter is off", () => {
      renderView([STEP_1_OPEN, MISSED_DEADLINE_OPEN]);
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(screen.getByText("Missed Deadline Grievance")).toBeInTheDocument();
    });

    it("shows only grievances with a missed deadline when filter is on", () => {
      renderView([STEP_1_OPEN, MISSED_DEADLINE_OPEN]);
      fireEvent.click(screen.getByRole("switch", { name: /missed deadline/i }));
      expect(
        screen.queryByText("Unsafe Working Conditions"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Missed Deadline Grievance")).toBeInTheDocument();
    });

    it("matches grievances where any escalation has a missed deadline", () => {
      const multiEscalation: Grievance = {
        id: 10,
        name: "Multi-Escalation Grievance",
        description: "Has multiple escalations, one with a missed deadline.",
        category: "Workload",
        point_person: "Test User",
        escalations: [
          {
            id: 10,
            date: CURRENT_YEAR_DATE,
            step: "Step #1",
            status: "Waiting to Schedule",
            date_due: "2026-01-01",
            hearing_date: null,
            deadline_missed: true,
            user: { id: 1, is_active: true, name: "Admin User" },
          },
          {
            id: 11,
            date: CURRENT_YEAR_DATE,
            step: "Step #2",
            status: "Scheduled",
            date_due: "2026-06-01",
            hearing_date: null,
            deadline_missed: false,
            user: { id: 1, is_active: true, name: "Admin User" },
          },
        ],
      };
      renderView([STEP_1_OPEN, multiEscalation]);
      fireEvent.click(screen.getByRole("switch", { name: /missed deadline/i }));
      expect(
        screen.queryByText("Unsafe Working Conditions"),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("Multi-Escalation Grievance"),
      ).toBeInTheDocument();
    });
  });

  describe("combined filters (AND logic)", () => {
    it("applies step and category filters together", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN]);
      // Step 1 + Health & Safety should only match STEP_1_OPEN
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      fireEvent.click(screen.getByRole("button", { name: "Health & Safety" }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.queryByText("Denial of Bereavement Leave"),
      ).not.toBeInTheDocument();
    });

    it("applies step and missed deadline filters together", () => {
      renderView([STEP_1_OPEN, MISSED_DEADLINE_OPEN]);
      // Both are Step 1; only MISSED_DEADLINE_OPEN has missed deadline
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      fireEvent.click(screen.getByRole("switch", { name: /missed deadline/i }));
      expect(
        screen.queryByText("Unsafe Working Conditions"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Missed Deadline Grievance")).toBeInTheDocument();
    });
  });

  describe("show/hide closed", () => {
    it("hides closed grievances by default", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED]);
      expect(
        screen.queryByText("Resolved Pay Dispute"),
      ).not.toBeInTheDocument();
    });

    it("shows closed grievances after toggling the switch on", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED]);
      fireEvent.click(screen.getByRole("switch", { name: /show closed/i }));
      expect(screen.getByText("Resolved Pay Dispute")).toBeInTheDocument();
    });

    it("hides closed grievances again after toggling off", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED]);
      fireEvent.click(screen.getByRole("switch", { name: /show closed/i }));
      fireEvent.click(screen.getByRole("switch", { name: /hide closed/i }));
      expect(
        screen.queryByText("Resolved Pay Dispute"),
      ).not.toBeInTheDocument();
    });

    it("shows the closed count in the toggle button", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED, STEP_2_CLOSED]);
      expect(
        screen.getByRole("switch", { name: /show closed \(2\)/i }),
      ).toBeInTheDocument();
    });

    it("shows a Closed section heading when toggle is on", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED]);
      fireEvent.click(screen.getByRole("switch", { name: /show closed/i }));
      expect(screen.getByText(/^Closed \(1\)/)).toBeInTheDocument();
    });

    it("applies other filters to closed grievances too", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED, STEP_2_CLOSED]);
      fireEvent.click(screen.getByRole("switch", { name: /show closed/i }));
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(screen.getByText("Resolved Pay Dispute")).toBeInTheDocument();
      expect(
        screen.queryByText("Denied Overtime Claim"),
      ).not.toBeInTheDocument();
    });
  });

  describe("clear all filters", () => {
    it("does not show the clear all button when no filters are active", () => {
      renderView([STEP_1_OPEN]);
      expect(
        screen.queryByRole("button", { name: /clear all/i }),
      ).not.toBeInTheDocument();
    });

    it("shows the clear all button when a filter is active", () => {
      renderView([STEP_1_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      expect(
        screen.getByRole("button", { name: /clear all/i }),
      ).toBeInTheDocument();
    });

    it("resets all filters when clear all is clicked", () => {
      renderView([STEP_1_OPEN, STEP_2_OPEN, LAST_YEAR_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 1/i }));
      fireEvent.click(
        screen.getByRole("switch", {
          name: new RegExp(`${CURRENT_YEAR} only`),
        }),
      );
      fireEvent.click(screen.getByRole("button", { name: /clear all/i }));
      expect(screen.getByText("Unsafe Working Conditions")).toBeInTheDocument();
      expect(
        screen.getByText("Denial of Bereavement Leave"),
      ).toBeInTheDocument();
      expect(screen.getByText("Last Year Grievance")).toBeInTheDocument();
    });
  });

  describe("empty states", () => {
    it("shows an empty state message when no grievances match the filters", () => {
      renderView([STEP_1_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 3/i }));
      expect(
        screen.getByText("No grievances match these filters."),
      ).toBeInTheDocument();
    });

    it("shows a clear filters link in the empty state when filters are active", () => {
      renderView([STEP_1_OPEN]);
      fireEvent.click(screen.getByRole("button", { name: /step 3/i }));
      expect(
        screen.getByRole("button", { name: /clear filters/i }),
      ).toBeInTheDocument();
    });

    it("shows empty closed state message when no closed grievances match filters", () => {
      renderView([STEP_1_OPEN, STEP_1_CLOSED]);
      fireEvent.click(screen.getByRole("switch", { name: /show closed/i }));
      fireEvent.click(screen.getByRole("button", { name: /step 3/i }));
      expect(
        screen.getByText("No closed grievances match these filters."),
      ).toBeInTheDocument();
    });
  });
});
