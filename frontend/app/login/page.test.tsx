import { render, screen } from "@testing-library/react";
import { useActionState } from "react";
import Login from "./page";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

jest.mock("./actions", () => ({
  login: jest.fn(),
}));

const mockAction = jest.fn();

beforeEach(() => {
  (useActionState as jest.Mock).mockReturnValue([{ error: null }, mockAction]);
});

describe("Login page", () => {
  it("renders the page title", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: "Log In" })).toBeInTheDocument();
  });

  it("renders the email field", () => {
    render(<Login />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("renders the password field", () => {
    render(<Login />);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<Login />);
    expect(
      screen.getByRole("button", { name: "Log In" }),
    ).toBeInTheDocument();
  });

  it("does not show an error message when there is no error", () => {
    render(<Login />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("shows the error message when state has an error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Invalid credentials" },
      mockAction,
    ]);

    render(<Login />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
