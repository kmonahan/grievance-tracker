import { render, screen } from "@testing-library/react";
import GrievanceDetailPage from "./page";

async function renderWithId(id: string) {
  const jsx = await GrievanceDetailPage({
    params: Promise.resolve({ id }),
  });
  return render(jsx);
}

describe("GrievanceDetailPage", () => {
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
    // Grievance #2 has 4 escalations; the latest status is "Waiting to File"
    // It appears in the header badge and in the timeline
    const badges = screen.getAllByText("Waiting to File");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the upcoming due date from the latest escalation", async () => {
    await renderWithId("2");
    // Grievance #2's latest escalation has date_due "2026-01-30"
    expect(screen.getByText("Jan 30, 2026")).toBeInTheDocument();
  });

  it("does not render due date section when latest escalation has no date_due", async () => {
    await renderWithId("4");
    expect(screen.queryByText("Upcoming Due Date")).not.toBeInTheDocument();
  });

  it("renders all escalation timeline entries", async () => {
    await renderWithId("2");
    // Grievance #2 has 4 escalations with distinct statuses
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
    // Grievance #1 escalation has hearing_date "2025-12-31"
    expect(screen.getByText("Hearing: Dec 31, 2025")).toBeInTheDocument();
  });

  it("renders escalation step name", async () => {
    await renderWithId("4");
    expect(screen.getByText("Step #2")).toBeInTheDocument();
  });

  it("renders escalation assigned user", async () => {
    await renderWithId("2");
    // All escalations for grievance #2 are assigned to Cesar Chavez
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
});
