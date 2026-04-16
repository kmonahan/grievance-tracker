import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UsersPage from "./page";
import { UserStatusToggle } from "./UserStatusToggle";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), refresh: jest.fn() })),
}));

const ACTIVE_USER = { id: 1, name: "Alice Smith", is_active: true };
const INACTIVE_USER = { id: 2, name: "Bob Jones", is_active: false };

function mockFetchUsers(users: (typeof ACTIVE_USER)[]) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ users }),
  });
}

async function renderPage() {
  const jsx = await UsersPage();
  return render(jsx);
}

beforeEach(() => {
  process.env.BACKEND_URL = "http://localhost:8000";
  jest.clearAllMocks();
  mockCookiesGet.mockReturnValue({ value: "test-access-token" });
});

describe("UsersPage", () => {
  it("fetches from /users with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchUsers([ACTIVE_USER]);
    await UsersPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/users",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("renders the page heading", async () => {
    mockFetchUsers([ACTIVE_USER]);
    await renderPage();
    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
  });

  it("renders each user's name", async () => {
    mockFetchUsers([ACTIVE_USER, INACTIVE_USER]);
    await renderPage();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("displays active status for active users", async () => {
    mockFetchUsers([ACTIVE_USER]);
    await renderPage();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it("displays inactive status for inactive users", async () => {
    mockFetchUsers([INACTIVE_USER]);
    await renderPage();
    expect(screen.getByText(/inactive/i)).toBeInTheDocument();
  });

  it("links active user's name to the edit form", async () => {
    mockFetchUsers([ACTIVE_USER]);
    await renderPage();
    const link = screen.getByRole("link", { name: "Alice Smith" });
    expect(link).toHaveAttribute("href", "/settings/edit-user/1");
  });

  it("does not link inactive user's name to the edit form", async () => {
    mockFetchUsers([INACTIVE_USER]);
    await renderPage();
    const nameEl = screen.getByText("Bob Jones");
    expect(nameEl.tagName.toLowerCase()).not.toBe("a");
    expect(nameEl.closest("a")).toBeNull();
  });

  it("renders a toggle for each user", async () => {
    mockFetchUsers([ACTIVE_USER, INACTIVE_USER]);
    await renderPage();
    // Each user should have a toggle button
    const toggleButtons = screen.getAllByRole("button");
    expect(toggleButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders an empty state when there are no users", async () => {
    mockFetchUsers([]);
    await renderPage();
    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });
});

describe("UserStatusToggle – active user", () => {
  it("renders a 'Deactivate' button for an active user", () => {
    render(
      <UserStatusToggle userId={1} isActive={true} isCurrentUser={false} />,
    );
    expect(
      screen.getByRole("button", { name: /deactivate/i }),
    ).toBeInTheDocument();
  });

  it("sends a PATCH request to /users/deactivate/<id> when clicked", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(
      <UserStatusToggle userId={1} isActive={true} isCurrentUser={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /deactivate/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/users/deactivate/1",
        expect.objectContaining({ method: "PATCH" }),
      );
    });
  });

  it("disables the 'Deactivate' button when the user is the current user", () => {
    render(
      <UserStatusToggle userId={3} isActive={true} isCurrentUser={true} />,
    );
    expect(screen.getByRole("button", { name: /deactivate/i })).toBeDisabled();
  });
});

describe("UserStatusToggle – inactive user", () => {
  it("renders a 'Reactivate' button for an inactive user", () => {
    render(
      <UserStatusToggle userId={2} isActive={false} isCurrentUser={false} />,
    );
    expect(
      screen.getByRole("button", { name: /reactivate/i }),
    ).toBeInTheDocument();
  });

  it("sends a PATCH request to /users/reactivate/<id> when clicked", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(
      <UserStatusToggle userId={2} isActive={false} isCurrentUser={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /reactivate/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/users/reactivate/2",
        expect.objectContaining({ method: "PATCH" }),
      );
    });
  });

  it("does not disable the 'Reactivate' button even when user is current user", () => {
    render(
      <UserStatusToggle userId={3} isActive={false} isCurrentUser={true} />,
    );
    expect(
      screen.getByRole("button", { name: /reactivate/i }),
    ).not.toBeDisabled();
  });
});
