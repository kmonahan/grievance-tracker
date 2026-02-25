import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";

const mockOnClose = jest.fn();

beforeEach(() => {
  mockOnClose.mockClear();
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
});

describe("Modal", () => {
  it("renders children inside a dialog", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        Modal content
      </Modal>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls showModal when open is true", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        content
      </Modal>,
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("does not call showModal when open is false", () => {
    render(
      <Modal open={false} onClose={mockOnClose}>
        content
      </Modal>,
    );
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it("calls onClose callback when the dialog closes", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        content
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    dialog.dispatchEvent(new Event("close", { bubbles: true }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders a close button", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        content
      </Modal>,
    );
    expect(
      screen.getByRole("button", { name: "Close", hidden: true }),
    ).toBeInTheDocument();
  });

  it("closes the dialog when the close button is clicked", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        content
      </Modal>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Close", hidden: true }),
    );
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it("closes the dialog when clicking the backdrop", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        content
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent.click(dialog);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it("does not close the dialog when clicking inside the content", () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <div>content</div>
      </Modal>,
    );
    fireEvent.click(screen.getByText("content"));
    expect(HTMLDialogElement.prototype.close).not.toHaveBeenCalled();
  });
});
