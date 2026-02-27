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

jest.mock("~/app/grievances/actions", () => ({
  addGrievance: jest.fn(),
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

const grievanceInitialState: {
  error: string | null;
  errors: Record<string, string[]>[] | null;
  fields: Record<string, string>;
} = {
  error: null,
  errors: null,
  fields: {},
};

const categoryInitialState = { error: null, success: false };

function mockBothActionStates(
  grievanceState = grievanceInitialState,
  categoryState = categoryInitialState,
) {
  (useActionState as jest.Mock)
    .mockReturnValueOnce([grievanceState, mockAction])
    .mockReturnValueOnce([categoryState, mockAction]);
}

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

  describe("form submission", () => {
    it("wires the form action to the addGrievance server action", () => {
      mockBothActionStates();
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={mockPointPersonsObjects}
        />,
      );
      const form = screen
        .getByRole("textbox", { name: "Name" })
        .closest("form");
      expect(form).toBeInTheDocument();
    });

    it("includes a category_id field in the form", () => {
      mockBothActionStates();
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={mockPointPersonsObjects}
        />,
      );
      const categorySelect = screen.getByLabelText("Category");
      expect(categorySelect).toHaveAttribute("name", "category_id");
    });

    it("includes a point_person_id field in the form", () => {
      mockBothActionStates();
      render(
        <CreateGrievanceForm
          categories={mockCategories}
          pointPersons={mockPointPersonsObjects}
        />,
      );
      const pointPersonSelect = screen.getByLabelText("Point Person");
      expect(pointPersonSelect).toHaveAttribute("name", "point_person_id");
    });

    describe("when submission fails with a general error", () => {
      it("displays the general error message", () => {
        mockBothActionStates({
          error: "Name is required",
          errors: null,
          fields: {
            name: "",
            description: "",
            category_id: "",
            point_person_id: "",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByText("Name is required")).toBeInTheDocument();
      });

      it("preserves the name field value on error", () => {
        mockBothActionStates({
          error: "Something went wrong",
          errors: null,
          fields: {
            name: "Unsafe conditions",
            description: "Broken equipment",
            category_id: "1",
            point_person_id: "2",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
          "Unsafe conditions",
        );
      });

      it("preserves the description field value on error", () => {
        mockBothActionStates({
          error: "Something went wrong",
          errors: null,
          fields: {
            name: "Unsafe conditions",
            description: "Broken equipment in the workshop",
            category_id: "1",
            point_person_id: "2",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByLabelText("Description")).toHaveValue(
          "Broken equipment in the workshop",
        );
      });

      it("preserves the category selection on error", () => {
        mockBothActionStates({
          error: "Something went wrong",
          errors: null,
          fields: {
            name: "Unsafe conditions",
            description: "Broken equipment",
            category_id: "2",
            point_person_id: "1",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByLabelText("Category")).toHaveValue("2");
      });

      it("preserves the point person selection on error", () => {
        mockBothActionStates({
          error: "Something went wrong",
          errors: null,
          fields: {
            name: "Unsafe conditions",
            description: "Broken equipment",
            category_id: "1",
            point_person_id: "3",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByLabelText("Point Person")).toHaveValue("3");
      });
    });

    describe("when submission fails with field-specific errors", () => {
      it("displays all field-specific error messages", () => {
        mockBothActionStates({
          error: "Validation failed",
          errors: [
            {
              name: ["Name is required", "Name must be at least 3 characters"],
            },
            { description: ["Description is required"] },
          ],
          fields: {
            name: "",
            description: "",
            category_id: "",
            point_person_id: "",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByText("Name is required")).toBeInTheDocument();
        expect(
          screen.getByText("Name must be at least 3 characters"),
        ).toBeInTheDocument();
        expect(screen.getByText("Description is required")).toBeInTheDocument();
      });

      it("preserves all field values when field-specific errors are present", () => {
        mockBothActionStates({
          error: "Validation failed",
          errors: [{ name: ["Name must be at least 3 characters"] }],
          fields: {
            name: "AB",
            description: "A valid description",
            category_id: "1",
            point_person_id: "2",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("AB");
        expect(screen.getByLabelText("Description")).toHaveValue(
          "A valid description",
        );
        expect(screen.getByLabelText("Category")).toHaveValue("1");
        expect(screen.getByLabelText("Point Person")).toHaveValue("2");
      });
    });

    describe("when submission fails, the form remains interactive", () => {
      it("does not disable form fields on submission error", () => {
        mockBothActionStates({
          error: "Something went wrong",
          errors: null,
          fields: {
            name: "Test",
            description: "Test desc",
            category_id: "1",
            point_person_id: "2",
          },
        });
        render(
          <CreateGrievanceForm
            categories={mockCategories}
            pointPersons={mockPointPersonsObjects}
          />,
        );
        expect(
          screen.getByRole("textbox", { name: "Name" }),
        ).not.toBeDisabled();
        expect(screen.getByLabelText("Description")).not.toBeDisabled();
        expect(screen.getByLabelText("Category")).not.toBeDisabled();
        expect(screen.getByLabelText("Point Person")).not.toBeDisabled();
        expect(
          screen.getByRole("button", { name: "Submit" }),
        ).not.toBeDisabled();
      });
    });
  });
});
