import { render, screen } from "@testing-library/react";
import { StatusTag } from "./StatusTag";

describe("StatusTag", () => {
  it("renders the status text", () => {
    render(<StatusTag status="Waiting to Schedule" />);
    expect(screen.getByText("Waiting to Schedule")).toBeInTheDocument();
  });

  it("applies known status color classes", () => {
    const { container } = render(<StatusTag status="Scheduled" />);
    expect(container.firstChild).toHaveClass("bg-teal-500");
  });

  it("applies fallback classes for unknown status", () => {
    const { container } = render(<StatusTag status="Unknown Status" />);
    expect(container.firstChild).toHaveClass("bg-muted");
    expect(container.firstChild).toHaveClass("text-muted-foreground");
  });
});
