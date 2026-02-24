import { render, screen } from "@testing-library/react";
import { useActionState } from "react";
import AddCategoryForm from "./AddCategoryForm";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

jest.mock("~/app/categories/actions", () => ({
  addCategory: jest.fn(),
}));

const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

const mockAction = jest.fn();

beforeEach(() => {
  mockBack.mockClear();
  (useActionState as jest.Mock).mockReturnValue([
    { error: null, success: false },
    mockAction,
  ]);
});

describe("AddCategoryForm", () => {
  it("renders the Name field", () => {
    render(<AddCategoryForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the Name field as required", () => {
    render(<AddCategoryForm />);
    expect(screen.getByLabelText("Name")).toBeRequired();
  });

  it("renders the Name field with maxLength 255", () => {
    render(<AddCategoryForm />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("maxLength", "255");
  });

  it("renders a submit button", () => {
    render(<AddCategoryForm />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("does not show an error message when there is no error", () => {
    render(<AddCategoryForm />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("shows the error message when state has an error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Name already taken", success: false },
      mockAction,
    ]);

    render(<AddCategoryForm />);

    expect(screen.getByText("Name already taken")).toBeInTheDocument();
  });

  it("calls router.back() on form submission", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: null, success: true },
      mockAction,
    ]);

    render(<AddCategoryForm />);

    expect(mockBack).toHaveBeenCalled();
  });
});
