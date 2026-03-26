import { render, screen } from "@testing-library/react";
import type { Escalation } from "~/app/grievances/types";
import { EscalationTimeline } from "./EscalationTimeline";

const BASE_ESCALATION: Escalation = {
  id: 1,
  date: "2025-12-19",
  step: "Step #1",
  status: "Waiting to Schedule",
  date_due: null,
  hearing_date: null,
  deadline_missed: false,
  user: { id: 1, is_active: true, name: "Walter Reuther" },
};

describe("EscalationTimeline", () => {
  it("renders the escalation date", () => {
    render(<EscalationTimeline escalations={[BASE_ESCALATION]} />);
    expect(screen.getByText("Dec 19, 2025")).toBeInTheDocument();
  });

  it("renders the step name", () => {
    render(<EscalationTimeline escalations={[BASE_ESCALATION]} />);
    expect(screen.getByText("Step #1")).toBeInTheDocument();
  });

  it("renders the status tag", () => {
    render(<EscalationTimeline escalations={[BASE_ESCALATION]} />);
    expect(screen.getByText("Waiting to Schedule")).toBeInTheDocument();
  });

  it("renders the assigned user name and initials", () => {
    render(<EscalationTimeline escalations={[BASE_ESCALATION]} />);
    expect(screen.getByText("Walter Reuther")).toBeInTheDocument();
    expect(screen.getByText("WR")).toBeInTheDocument();
  });

  it("renders hearing date when present", () => {
    const esc = { ...BASE_ESCALATION, hearing_date: "2025-12-31" };
    render(<EscalationTimeline escalations={[esc]} />);
    expect(screen.getByText("Hearing: Dec 31, 2025")).toBeInTheDocument();
  });

  it("does not render hearing date when absent", () => {
    render(<EscalationTimeline escalations={[BASE_ESCALATION]} />);
    expect(screen.queryByText(/Hearing:/)).not.toBeInTheDocument();
  });

  it("renders due date when present", () => {
    const esc = { ...BASE_ESCALATION, date_due: "2026-01-02" };
    render(<EscalationTimeline escalations={[esc]} />);
    expect(screen.getByText("Due: Jan 2, 2026")).toBeInTheDocument();
  });

  it("does not render due date when absent", () => {
    render(<EscalationTimeline escalations={[BASE_ESCALATION]} />);
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it("renders multiple escalations in reverse chronological order", () => {
    const escalations: Escalation[] = [
      { ...BASE_ESCALATION, id: 1, date: "2025-12-01", status: "Scheduled" },
      {
        ...BASE_ESCALATION,
        id: 2,
        date: "2025-12-15",
        status: "Waiting on Decision",
      },
    ];
    render(<EscalationTimeline escalations={escalations} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Waiting on Decision");
    expect(items[1]).toHaveTextContent("Scheduled");
  });
});
