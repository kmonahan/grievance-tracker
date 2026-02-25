import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import CreateGrievanceForm from "./CreateGrievanceForm";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

jest.mock("~/app/categories/actions", () => ({
  addCategory: jest.fn(),
}));

const mockAction = jest.fn();

const mockCategories = [
  { id: 1, name: "Pay" },
  { id: 2, name: "PTO" },
];

const mockPointPersons = ["Walter Reuther", "Cesar Chavez"];

beforeEach(() => {
  jest.clearAllMocks();
  HTMLDialogElement.prototype.showModal = jest.fn(function (
    this: HTMLDialogElement,
  ) {
    Object.defineProperty(this, "open", { value: true, configurable: true });
  });
  HTMLDialogElement.prototype.close = jest.fn(function (
    this: HTMLDialogElement,
  ) {
    Object.defineProperty(this, "open", { value: false, configurable: true });
  });
  (useActionState as jest.Mock).mockReturnValue([
    { error: null, success: false },
    mockAction,
  ]);
});

describe("CreateGrievanceForm", () => {
  it("renders the grievance Name field", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("renders the Description field", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("renders the Category select", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("renders categories as dropdown options", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByRole("option", { name: "Pay" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PTO" })).toBeInTheDocument();
  });

  it("renders the Point Person select", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByLabelText("Point Person")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders the '+ Add Category' button", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(
      screen.getByRole("button", { name: "+ Add Category" }),
    ).toBeInTheDocument();
  });

  it("opens the dialog when '+ Add Category' is clicked", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add Category" }));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("dialog contains Category Name field and Submit button for adding a category", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add Category" }));
    expect(screen.getByLabelText("Category Name")).toBeInTheDocument();
  });

  it("closes the dialog when the close button is clicked", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add Category" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Close", hidden: true }),
    );
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it("displays an error message when category creation fails", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Name already taken", success: false },
      mockAction,
    ]);
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );
    expect(screen.getByText("Name already taken")).toBeInTheDocument();
  });

  it("adds new category to dropdown and auto-selects it on success", () => {
    const { rerender } = render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );

    (useActionState as jest.Mock).mockReturnValue([
      { error: null, success: true, category: { id: 4, name: "New Category" } },
      mockAction,
    ]);

    rerender(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );

    expect(
      screen.getByRole("option", { name: "New Category" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toHaveValue("4");
  });

  it("closes the dialog on successful category creation", () => {
    const { rerender } = render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );

    // Open the modal first
    fireEvent.click(screen.getByRole("button", { name: "+ Add Category" }));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    // Simulate successful creation
    (useActionState as jest.Mock).mockReturnValue([
      { error: null, success: true, category: { id: 4, name: "New Category" } },
      mockAction,
    ]);

    rerender(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersons}
      />,
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });
});
