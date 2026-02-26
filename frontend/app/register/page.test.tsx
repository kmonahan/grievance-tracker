import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import Register from "./page";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

jest.mock("./actions", () => ({
  register: jest.fn(),
}));

const mockAction = jest.fn();

const emptyState = { error: null, errors: null, fields: {} };

beforeEach(() => {
  (useActionState as jest.Mock).mockReturnValue([emptyState, mockAction]);
});

describe("Register page", () => {
  it("renders the page title", () => {
    render(<Register />);
    expect(
      screen.getByRole("heading", { name: "Create Account" }),
    ).toBeInTheDocument();
  });

  it("renders the name field", () => {
    render(<Register />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the email field", () => {
    render(<Register />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("renders the password field", () => {
    render(<Register />);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders the confirm password field", () => {
    render(<Register />);
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<Register />);
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });

  it("does not show an error message when there is no error", () => {
    render(<Register />);
    expect(
      screen.queryByText("An error occurred. Please try again."),
    ).not.toBeInTheDocument();
  });

  it("displays a general error message when state has an error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Email already registered", errors: null, fields: {} },
      mockAction,
    ]);

    render(<Register />);

    expect(screen.getByText("Email already registered")).toBeInTheDocument();
  });

  it("displays field-specific error messages", () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: null,
        errors: [
          {
            password: [
              "Password must be at least 12 characters",
              "Passwords must match",
            ],
          },
        ],
        fields: {},
      },
      mockAction,
    ]);

    render(<Register />);

    expect(
      screen.getByText("Password must be at least 12 characters"),
    ).toBeInTheDocument();
    expect(screen.getByText("Passwords must match")).toBeInTheDocument();
  });

  it("preserves previously entered field values on error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: "Email already registered",
        errors: null,
        fields: {
          name: "Test User",
          email: "test@example.com",
          password: "securepassword",
          confirm: "securepassword",
        },
      },
      mockAction,
    ]);

    render(<Register />);

    expect(screen.getByLabelText("Name")).toHaveValue("Test User");
    expect(screen.getByLabelText("Email address")).toHaveValue(
      "test@example.com",
    );
    expect(screen.getByLabelText("Password")).toHaveValue("securepassword");
    expect(screen.getByLabelText("Confirm password")).toHaveValue(
      "securepassword",
    );
  });

  it("validates that passwords match", () => {
    render(<Register />);

    const password = screen.getByLabelText("Password");
    const confirm = screen.getByLabelText("Confirm password");

    fireEvent.change(password, { target: { value: "password123" } });
    fireEvent.change(confirm, { target: { value: "different" } });

    expect((confirm as HTMLInputElement).validationMessage).toBe(
      "Passwords do not match.",
    );
  });

  it("clears password mismatch validation when passwords match", () => {
    render(<Register />);

    const password = screen.getByLabelText("Password");
    const confirm = screen.getByLabelText("Confirm password");

    fireEvent.change(password, { target: { value: "password123" } });
    fireEvent.change(confirm, { target: { value: "different" } });

    expect((confirm as HTMLInputElement).validationMessage).toBe(
      "Passwords do not match.",
    );

    fireEvent.change(confirm, { target: { value: "password123" } });

    expect((confirm as HTMLInputElement).validationMessage).toBe("");
  });

  it("displays multiple field errors for different fields", () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: null,
        errors: [
          { email: ["Email is already taken"] },
          { password: ["Password is too short"] },
        ],
        fields: {},
      },
      mockAction,
    ]);

    render(<Register />);

    expect(screen.getByText("Email is already taken")).toBeInTheDocument();
    expect(screen.getByText("Password is too short")).toBeInTheDocument();
  });
});
