import { fireEvent, render, screen } from "@testing-library/react";
import AddCategoryForm from "./AddCategoryForm";

const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

beforeEach(() => {
  mockBack.mockClear();
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

  it("calls router.back() on form submission", () => {
    render(<AddCategoryForm />);
    fireEvent.submit(screen.getByRole("button", { name: "Submit" }));
    expect(mockBack).toHaveBeenCalled();
  });
});
