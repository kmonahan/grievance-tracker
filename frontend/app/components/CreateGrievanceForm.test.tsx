import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import type { PointPerson } from "~/app/grievances/create/page";
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

const mockPointPersonsObjects: PointPerson[] = [
  { id: 1, name: "Walter Reuther", isActive: true },
  { id: 2, name: "Cesar Chavez", isActive: true },
  { id: 3, name: "Clara Lemlich", isActive: true },
];

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
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("renders the Description field", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("renders the Category select", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("renders categories as dropdown options", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByRole("option", { name: "Pay" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PTO" })).toBeInTheDocument();
  });

  it("renders the Point Person select", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByLabelText("Point Person")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders the '+ Add Category' button", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
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
        pointPersons={mockPointPersonsObjects}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add Category" }));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("dialog contains Category Name field and Submit button for adding a category", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add Category" }));
    expect(screen.getByLabelText("Category Name")).toBeInTheDocument();
  });

  it("closes the dialog when the close button is clicked", () => {
    render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
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
        pointPersons={mockPointPersonsObjects}
      />,
    );
    expect(screen.getByText("Name already taken")).toBeInTheDocument();
  });

  it("adds new category to dropdown and auto-selects it on success", () => {
    const { rerender } = render(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
      />,
    );

    (useActionState as jest.Mock).mockReturnValue([
      { error: null, success: true, category: { id: 4, name: "New Category" } },
      mockAction,
    ]);

    rerender(
      <CreateGrievanceForm
        categories={mockCategories}
        pointPersons={mockPointPersonsObjects}
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
        pointPersons={mockPointPersonsObjects}
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
        pointPersons={mockPointPersonsObjects}
      />,
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  describe("Point Person field", () => {
    it("renders point persons from the API as dropdown options", () => {
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={mockPointPersonsObjects}
          defaultPointPersonId={null}
          pointPersonsError={null}
        />,
      );
      expect(
        screen.getByRole("option", { name: "Walter Reuther" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Cesar Chavez" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Clara Lemlich" }),
      ).toBeInTheDocument();
    });

    it("pre-selects the current user as the default point person", () => {
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={mockPointPersonsObjects}
          defaultPointPersonId={2}
          pointPersonsError={null}
        />,
      );
      expect(screen.getByLabelText("Point Person")).toHaveValue("2");
    });

    it("does not pre-select any point person when defaultPointPersonId is null", () => {
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={mockPointPersonsObjects}
          defaultPointPersonId={null}
          pointPersonsError={null}
        />,
      );
      expect(screen.getByLabelText("Point Person")).toHaveValue("");
    });
  });

  describe("when point persons fetch fails", () => {
    it("displays an error message above the form", () => {
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={[]}
          defaultPointPersonId={null}
          pointPersonsError="Failed to load user list."
        />,
      );
      expect(screen.getByText("Failed to load user list.")).toBeInTheDocument();
    });

    it("renders the error message before the form fields", () => {
      const { container } = render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={[]}
          defaultPointPersonId={null}
          pointPersonsError="Failed to load user list."
        />,
      );
      const errorEl = screen.getByText("Failed to load user list.");
      const nameField = screen.getByRole("textbox", { name: "Name" });
      expect(
        container.compareDocumentPosition(errorEl) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(
        errorEl.compareDocumentPosition(nameField) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("disables all form fields and the submit button", () => {
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={[]}
          defaultPointPersonId={null}
          pointPersonsError="Failed to load user list."
        />,
      );
      expect(screen.getByRole("textbox", { name: "Name" })).toBeDisabled();
      expect(screen.getByLabelText("Description")).toBeDisabled();
      expect(screen.getByLabelText("Category")).toBeDisabled();
      expect(screen.getByLabelText("Point Person")).toBeDisabled();
      expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    });
  });
});
