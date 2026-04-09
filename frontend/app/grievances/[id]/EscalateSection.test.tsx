import { fireEvent, render, screen, within } from "@testing-library/react";
import type { Grievance } from "~/app/grievances/types";
import { EscalateSection } from "./EscalateSection";

jest.mock("~/app/grievances/escalateAction", () => ({
  escalateGrievance: jest.fn().mockResolvedValue({ error: null }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type EscalationSeed = { step: string; status: string };

function makeGrievance(escalations: EscalationSeed[]): Grievance {
  return {
    id: 1,
    name: "Test Grievance",
    description: "Test description",
    category: "Pay",
    point_person: "Walter Reuther",
    escalations: escalations.map((e, i) => ({
      id: i + 1,
      date: `2025-12-${String(i + 1).padStart(2, "0")}`,
      step: e.step,
      status: e.status,
      date_due: null,
      hearing_date: null,
      deadline_missed: false,
      user: { id: 1, is_active: true, name: "Walter Reuther" },
    })),
  };
}

/** Renders the component and clicks the toggle button to show options. */
function renderExpanded(grievance: Grievance) {
  render(<EscalateSection grievance={grievance} />);
  fireEvent.click(screen.getByRole("button", { name: "Escalate" }));
}

/** Returns all radio inputs inside the "Select new status" fieldset. */
function getOptionRadios() {
  const fieldset = screen.getByRole("group", { name: /select new status/i });
  return within(fieldset).getAllByRole("radio") as HTMLInputElement[];
}

/** Returns the label element wrapping a given radio input. */
function getLabelFor(radio: HTMLInputElement) {
  // biome-ignore lint/style/noNonNullAssertion: radio inputs in these tests are always wrapped in a label
  return radio.closest("label")!;
}

// ---------------------------------------------------------------------------
// Option ordering
// ---------------------------------------------------------------------------

describe("EscalateSection – option ordering", () => {
  it("shows Step #1 Scheduled as the first option when at Step #1, Waiting to Schedule", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    const radios = getOptionRadios();
    const firstLabel = getLabelFor(radios[0]);
    expect(within(firstLabel).getByText("Scheduled")).toBeInTheDocument();
    expect(within(firstLabel).getByText(/Step #1/)).toBeInTheDocument();
  });

  it("shows Step #1 Waiting to File as the first option when at Step #1, Scheduled", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
      { step: "Step #1", status: "Scheduled" },
    ]);
    renderExpanded(grievance);

    const radios = getOptionRadios();
    const firstLabel = getLabelFor(radios[0]);
    expect(within(firstLabel).getByText("Waiting to File")).toBeInTheDocument();
    expect(within(firstLabel).getByText(/Step #1/)).toBeInTheDocument();
  });

  it("shows Step #2 Waiting to Schedule as the first option when at Step #1, Waiting to File", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
      { step: "Step #1", status: "Scheduled" },
      { step: "Step #1", status: "Waiting to File" },
    ]);
    renderExpanded(grievance);

    const radios = getOptionRadios();
    const firstLabel = getLabelFor(radios[0]);
    expect(
      within(firstLabel).getByText("Waiting to Schedule"),
    ).toBeInTheDocument();
    expect(within(firstLabel).getByText(/Step #2/)).toBeInTheDocument();
  });

  it("shows Step #2 Waiting on Decision as the first option when at Step #2, Scheduled", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
      { step: "Step #1", status: "Scheduled" },
      { step: "Step #1", status: "Waiting to File" },
      { step: "Step #2", status: "Waiting to Schedule" },
      { step: "Step #2", status: "Scheduled" },
    ]);
    renderExpanded(grievance);

    const radios = getOptionRadios();
    const firstLabel = getLabelFor(radios[0]);
    expect(
      within(firstLabel).getByText("Waiting on Decision"),
    ).toBeInTheDocument();
    expect(within(firstLabel).getByText(/Step #2/)).toBeInTheDocument();
  });

  it("shows no previous option when on the first escalation", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    // With a single escalation there is no "go back" option, so only the
    // next + always-available options should appear (not Waiting to Schedule).
    const radios = getOptionRadios();
    const values = radios.map((r) => r.value);
    // Waiting to Schedule is the current status — no reason to go back to it.
    expect(values).not.toContain("WAITING_TO_SCHEDULE");
  });

  it("shows the previous step/status as the last option when escalated before", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
      { step: "Step #1", status: "Scheduled" },
    ]);
    renderExpanded(grievance);

    const radios = getOptionRadios();
    const lastLabel = getLabelFor(radios[radios.length - 1]);
    expect(
      within(lastLabel).getByText("Waiting to Schedule"),
    ).toBeInTheDocument();
    expect(within(lastLabel).getByText(/Step #1/)).toBeInTheDocument();
  });

  it("shows Step #1 Scheduled as the last option when at Step #1, Waiting to File", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
      { step: "Step #1", status: "Scheduled" },
      { step: "Step #1", status: "Waiting to File" },
    ]);
    renderExpanded(grievance);

    const radios = getOptionRadios();
    const lastLabel = getLabelFor(radios[radios.length - 1]);
    expect(within(lastLabel).getByText("Scheduled")).toBeInTheDocument();
    expect(within(lastLabel).getByText(/Step #1/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Always-available options
// ---------------------------------------------------------------------------

describe("EscalateSection – always-available options", () => {
  it("shows Resolved as an option", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).getByText("Resolved")).toBeInTheDocument();
  });

  it("shows Denied as an option", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).getByText("Denied")).toBeInTheDocument();
  });

  it("shows Withdrawn as an option", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).getByText("Withdrawn")).toBeInTheDocument();
  });

  it("shows In Abeyance as an option", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).getByText("In Abeyance")).toBeInTheDocument();
  });

  it("does not show the current status as an option", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "In Abeyance" },
    ]);
    renderExpanded(grievance);

    // In Abeyance is the current status, so it must not appear as an option.
    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).queryByText("In Abeyance")).not.toBeInTheDocument();
  });

  it("does not show Resolved as an option when current status is Resolved", () => {
    const grievance = makeGrievance([{ step: "Step #1", status: "Resolved" }]);
    renderExpanded(grievance);

    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).queryByText("Resolved")).not.toBeInTheDocument();
  });

  it("does not show Withdrawn as an option when current status is Withdrawn", () => {
    const grievance = makeGrievance([{ step: "Step #1", status: "Withdrawn" }]);
    renderExpanded(grievance);

    const fieldset = screen.getByRole("group", { name: /select new status/i });
    expect(within(fieldset).queryByText("Withdrawn")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Hearing date input visibility
// ---------------------------------------------------------------------------

describe("EscalateSection – hearing date input", () => {
  it("does not show the hearing date input before any option is selected", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    expect(
      screen.queryByRole("textbox", { name: /hearing date/i }) ??
        screen.queryByLabelText(/hearing date/i),
    ).not.toBeInTheDocument();
  });

  it("shows a hearing date input when the Scheduled option is selected", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    fireEvent.click(screen.getByRole("radio", { name: /scheduled/i }));

    expect(screen.getByLabelText(/hearing date/i)).toBeInTheDocument();
  });

  it("hides the hearing date input when a non-Scheduled option is selected", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    // First select Scheduled so the date field appears…
    fireEvent.click(screen.getByRole("radio", { name: /scheduled/i }));
    expect(screen.getByLabelText(/hearing date/i)).toBeInTheDocument();

    // …then switch to a different option and the date field should disappear.
    fireEvent.click(screen.getByRole("radio", { name: /resolved/i }));
    expect(screen.queryByLabelText(/hearing date/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Submit button state
// ---------------------------------------------------------------------------

describe("EscalateSection – submit button", () => {
  it("does not show the submit button before any option is selected", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    expect(
      screen.queryByRole("button", { name: /submit escalation/i }),
    ).not.toBeInTheDocument();
  });

  it("shows an enabled submit button when a non-Scheduled option is selected", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    fireEvent.click(screen.getByRole("radio", { name: /resolved/i }));

    expect(
      screen.getByRole("button", { name: /submit escalation/i }),
    ).not.toBeDisabled();
  });

  it("shows a disabled submit button when Scheduled is selected but no date is entered", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    fireEvent.click(screen.getByRole("radio", { name: /scheduled/i }));

    expect(
      screen.getByRole("button", { name: /submit escalation/i }),
    ).toBeDisabled();
  });

  it("enables the submit button when Scheduled is selected and a hearing date is entered", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    fireEvent.click(screen.getByRole("radio", { name: /scheduled/i }));
    fireEvent.change(screen.getByLabelText(/hearing date/i), {
      target: { value: "2026-06-15" },
    });

    expect(
      screen.getByRole("button", { name: /submit escalation/i }),
    ).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Form fields submitted to the action
// ---------------------------------------------------------------------------

describe("EscalateSection – form data submitted to the action", () => {
  it("includes the grievance id as a hidden form field", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    render(<EscalateSection grievance={grievance} />);
    fireEvent.click(screen.getByRole("button", { name: "Escalate" }));

    // The hidden input for grievance_id should be present in the DOM.
    expect(
      document.querySelector('input[type="hidden"][name="grievance_id"]'),
    ).toHaveValue("1");
  });

  it("includes hidden step and status fields that reflect the selected option", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    // Select the first option (Step #1, Scheduled).
    const radios = getOptionRadios();
    fireEvent.click(radios[0]);

    // The form should carry the enum key for status.
    expect(document.querySelector('input[name="status"]')).toHaveValue(
      "SCHEDULED",
    );
    // The form should carry the enum key for step.
    expect(document.querySelector('input[name="step"]')).toHaveValue("ONE");
  });

  it("includes the hearing_date field when Scheduled is selected and a date is entered", () => {
    const grievance = makeGrievance([
      { step: "Step #1", status: "Waiting to Schedule" },
    ]);
    renderExpanded(grievance);

    fireEvent.click(screen.getByRole("radio", { name: /scheduled/i }));
    fireEvent.change(screen.getByLabelText(/hearing date/i), {
      target: { value: "2026-06-15" },
    });

    expect(screen.getByLabelText(/hearing date/i)).toHaveValue("2026-06-15");
  });
});
