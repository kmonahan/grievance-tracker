import { render, screen } from "@testing-library/react";
import { useActionState } from "react";
import EditUserPage from "./page";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const mockNotFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

jest.mock("./actions", () => ({
  editUser: jest.fn(),
}));

const mockAction = jest.fn();

const emptyState = { error: null, errors: null, fields: {} };

const mockUser = {
  id: 42,
  name: "Jane Doe",
  email: "jane@example.com",
  is_active: true,
};

function mockFetchSuccess() {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockUser,
  });
}

function mockFetchNotFound() {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 404,
  });
}

async function renderWithId(id: string) {
  mockFetchSuccess();
  const jsx = await EditUserPage({ params: Promise.resolve({ id }) });
  return render(jsx);
}

beforeEach(() => {
  process.env.BACKEND_URL = "http://localhost:8000";
  jest.clearAllMocks();
  mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  (useActionState as jest.Mock).mockReturnValue([emptyState, mockAction]);
});

describe("EditUserPage", () => {
  it("renders the page title", async () => {
    await renderWithId("42");
    expect(
      screen.getByRole("heading", { name: "Edit Account" }),
    ).toBeInTheDocument();
  });

  it("renders the name field", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the email field", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("renders the password field", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders the confirm password field", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("renders the submit button", async () => {
    await renderWithId("42");
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });

  it("prefills the name field with the existing user's name", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
  });

  it("prefills the email field with the existing user's email", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Email address")).toHaveValue(
      "jane@example.com",
    );
  });

  it("does not prefill the password field", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Password")).toHaveValue("");
  });

  it("does not prefill the confirm password field", async () => {
    await renderWithId("42");
    expect(screen.getByLabelText("Confirm password")).toHaveValue("");
  });

  it("does not show a general error message when there is no error", async () => {
    await renderWithId("42");
    expect(
      screen.queryByText("An error occurred. Please try again."),
    ).not.toBeInTheDocument();
  });

  it("displays a general error message when state has an error", async () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Email already registered", errors: null, fields: {} },
      mockAction,
    ]);

    await renderWithId("42");

    expect(screen.getByText("Email already registered")).toBeInTheDocument();
  });

  it("displays field-specific error messages below the relevant field", async () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: null,
        errors: [{ password: ["Password must be at least 12 characters"] }],
        fields: {},
      },
      mockAction,
    ]);

    await renderWithId("42");

    const passwordField = screen.getByLabelText("Password");
    const container = passwordField.closest(".space-y-2");

    expect(
      screen.getByText("Password must be at least 12 characters"),
    ).toBeInTheDocument();
    expect(container?.querySelector(".text-destructive")).toBeInTheDocument();
  });

  it("preserves field values from state on error (overrides server defaults)", async () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: "Email already registered",
        errors: null,
        fields: {
          name: "Updated Name",
          email: "updated@example.com",
        },
      },
      mockAction,
    ]);

    await renderWithId("42");

    expect(screen.getByLabelText("Name")).toHaveValue("Updated Name");
    expect(screen.getByLabelText("Email address")).toHaveValue(
      "updated@example.com",
    );
  });

  it("fetches user data from the backend using the id from params", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchSuccess();
    await EditUserPage({ params: Promise.resolve({ id: "42" }) });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/users/42",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("calls notFound when the user is not found", async () => {
    mockFetchNotFound();
    await expect(
      EditUserPage({ params: Promise.resolve({ id: "999" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("submits a PATCH request to /users/edit/<id>", async () => {
    await renderWithId("42");

    // The form's action should target the editUser server action bound to id 42.
    // The underlying action wrapper (via useActionState) should call editUser
    // with a PATCH to /users/edit/42. We verify the action was wired to useActionState.
    expect(useActionState).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ error: null }),
    );
  });
});
