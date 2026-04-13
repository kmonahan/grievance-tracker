import { fireEvent, render, screen } from "@testing-library/react";
import { EditDueDateSection } from "./EditDueDateSection";

jest.mock("~/app/grievances/editDueDateAction", () => ({
  editDueDate: jest.fn().mockResolvedValue({ error: null, updatedDate: null }),
}));

describe("EditDueDateSection – view mode", () => {
  it("renders the formatted due date", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    expect(screen.getByText("Jan 30, 2026")).toBeInTheDocument();
  });

  it("renders the Upcoming Due Date label", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    expect(screen.getByText("Upcoming Due Date")).toBeInTheDocument();
  });

  it("renders an Edit button", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("does not show the date input in view mode", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    expect(screen.queryByLabelText("New due date")).not.toBeInTheDocument();
  });
});

describe("EditDueDateSection – edit mode", () => {
  it("shows the date input when Edit is clicked", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByLabelText("New due date")).toBeInTheDocument();
  });

  it("pre-fills the date input with the current due date", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByLabelText("New due date")).toHaveValue("2026-01-30");
  });

  it("shows Save and Cancel buttons when editing", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("hides the Edit button while editing", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("returns to view mode when Cancel is clicked", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Jan 30, 2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.queryByLabelText("New due date")).not.toBeInTheDocument();
  });

  it("includes a hidden escalation_id field with the escalation id", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      document.querySelector('input[type="hidden"][name="escalation_id"]'),
    ).toHaveValue("4");
  });

  it("the date input is named date_due", () => {
    render(<EditDueDateSection escalationId={4} initialDateDue="2026-01-30" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      document.querySelector('input[name="date_due"]'),
    ).toBeInTheDocument();
  });
});
