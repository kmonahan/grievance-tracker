import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UsersPage from "./page";
import { UserStatusToggle } from "./UserStatusToggle";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), refresh: mockRefresh })),
}));

const mockToggleUserStatus = jest.fn();
jest.mock("./actions", () => ({
  toggleUserStatus: (...args: unknown[]) => mockToggleUserStatus(...args),
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
  mockToggleUserStatus.mockResolvedValue({ ok: true });
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

  it("does not link the active user's name to the edit form", async () => {
    mockFetchUsers([ACTIVE_USER]);
    await renderPage();
    const nameEl = screen.getByText("Alice Smith");
    expect(nameEl.tagName.toLowerCase()).not.toBe("a");
    expect(nameEl.closest("a")).toBeNull();
  });

  it("does not link the inactive user's name to the edit form", async () => {
    mockFetchUsers([INACTIVE_USER]);
    await renderPage();
    const nameEl = screen.getByText("Bob Jones");
    expect(nameEl.tagName.toLowerCase()).not.toBe("a");
    expect(nameEl.closest("a")).toBeNull();
  });

  it("renders an Edit button for each user", async () => {
    mockFetchUsers([ACTIVE_USER, INACTIVE_USER]);
    await renderPage();
    const editLinks = screen.getAllByRole("link", { name: /edit/i });
    expect(editLinks).toHaveLength(2);
  });

  it("Edit button for active user links to /settings/edit-user/[id]", async () => {
    mockFetchUsers([ACTIVE_USER]);
    await renderPage();
    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/settings/edit-user/1");
  });

  it("Edit button for inactive user links to /settings/edit-user/[id]", async () => {
    mockFetchUsers([INACTIVE_USER]);
    await renderPage();
    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/settings/edit-user/2");
  });

  it("renders a toggle for each user", async () => {
    mockFetchUsers([ACTIVE_USER, INACTIVE_USER]);
    await renderPage();
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

  it("calls toggleUserStatus with userId and isActive=true when clicked", async () => {
    render(
      <UserStatusToggle userId={1} isActive={true} isCurrentUser={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /deactivate/i }));
    await waitFor(() => {
      expect(mockToggleUserStatus).toHaveBeenCalledWith(1, true);
    });
  });

  it("refreshes the router after a successful deactivate", async () => {
    render(
      <UserStatusToggle userId={1} isActive={true} isCurrentUser={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /deactivate/i }));
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("does not refresh the router when deactivate fails", async () => {
    mockToggleUserStatus.mockResolvedValueOnce({ ok: false });
    render(
      <UserStatusToggle userId={1} isActive={true} isCurrentUser={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /deactivate/i }));
    await waitFor(() => {
      expect(mockToggleUserStatus).toHaveBeenCalled();
    });
    expect(mockRefresh).not.toHaveBeenCalled();
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

  it("calls toggleUserStatus with userId and isActive=false when clicked", async () => {
    render(
      <UserStatusToggle userId={2} isActive={false} isCurrentUser={false} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /reactivate/i }));
    await waitFor(() => {
      expect(mockToggleUserStatus).toHaveBeenCalledWith(2, false);
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
