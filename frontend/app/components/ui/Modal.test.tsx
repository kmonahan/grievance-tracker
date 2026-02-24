import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";

const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

beforeEach(() => {
  mockBack.mockClear();
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
});

describe("Modal", () => {
  it("renders children inside a dialog", () => {
    render(<Modal>Modal content</Modal>);
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls showModal on mount", () => {
    render(<Modal>content</Modal>);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("calls router.back() when the dialog is closed", () => {
    render(<Modal>content</Modal>);
    const dialog = screen.getByRole("dialog", { hidden: true });
    dialog.dispatchEvent(new Event("close", { bubbles: true }));
    expect(mockBack).toHaveBeenCalled();
  });

  it("renders a close button", () => {
    render(<Modal>content</Modal>);
    expect(
      screen.getByRole("button", { name: "Close", hidden: true }),
    ).toBeInTheDocument();
  });

  it("closes the dialog when the close button is clicked", () => {
    render(<Modal>content</Modal>);
    fireEvent.click(
      screen.getByRole("button", { name: "Close", hidden: true }),
    );
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it("closes the dialog when clicking the backdrop", () => {
    render(<Modal>content</Modal>);
    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent.click(dialog);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it("does not close the dialog when clicking inside the content", () => {
    render(
      <Modal>
        <div>content</div>
      </Modal>,
    );
    fireEvent.click(screen.getByText("content"));
    expect(HTMLDialogElement.prototype.close).not.toHaveBeenCalled();
  });
});
