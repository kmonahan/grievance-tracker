import { render, screen } from "@testing-library/react";
import CreateGrievance from "./page";

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

jest.mock("~/app/components/CreateGrievanceForm", () => {
  const MockCreateGrievanceForm = ({
    categories,
    pointPersons,
    defaultPointPersonId,
    pointPersonsError,
  }: {
    categories: { id: number; name: string }[];
    pointPersons: { id: number; name: string; isActive: boolean }[];
    defaultPointPersonId?: number | null;
    pointPersonsError?: string | null;
  }) => (
    <div>
      <h1>Create New Grievance</h1>
      {pointPersonsError && (
        <p data-testid="point-persons-error">{pointPersonsError}</p>
      )}
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <ul data-testid="point-persons-list">
        {(pointPersons ?? []).map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      {defaultPointPersonId != null && (
        <span data-testid="default-point-person-id">
          {defaultPointPersonId}
        </span>
      )}
    </div>
  );
  MockCreateGrievanceForm.displayName = "CreateGrievanceForm";
  return MockCreateGrievanceForm;
});

const mockCategories = [
  { id: 1, name: "Pay" },
  { id: 2, name: "PTO" },
  { id: 3, name: "Health & Safety" },
];

const mockPointPersons = [
  { id: 1, name: "Walter Reuther", isActive: true },
  { id: 2, name: "Cesar Chavez", isActive: true },
];

const mockCurrentUser = { id: 2, name: "Cesar Chavez", isActive: true };

beforeEach(() => {
  jest.clearAllMocks();
  mockCookiesGet.mockReturnValue({ value: "test-token" });
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ categories: mockCategories }),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("CreateGrievance page", () => {
  it("renders the page title", async () => {
    render(await CreateGrievance());
    expect(
      screen.getByRole("heading", { name: "Create New Grievance" }),
    ).toBeInTheDocument();
  });

  it("renders categories fetched from the backend", async () => {
    render(await CreateGrievance());
    expect(screen.getByText("Pay")).toBeInTheDocument();
    expect(screen.getByText("PTO")).toBeInTheDocument();
    expect(screen.getByText("Health & Safety")).toBeInTheDocument();
  });

  it("renders no categories when the fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(await CreateGrievance());
    expect(screen.queryByText("Pay")).not.toBeInTheDocument();
  });

  it("fetches categories with the 'categories' cache tag", async () => {
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.objectContaining({ next: { tags: ["categories"] } }),
    );
  });

  it("fetches categories with the Authorization header when logged in", async () => {
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("fetches categories without an Authorization header when not logged in", async () => {
    mockCookiesGet.mockReturnValue(undefined);
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.objectContaining({ headers: {} }),
    );
  });
});

describe("CreateGrievance page - Point Persons", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes("/users/active")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ users: mockPointPersons }),
        });
      }
      if (url.includes("/users/me")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCurrentUser),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });
    });
  });

  it("fetches point persons from the /users/active endpoint", async () => {
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/active"),
      expect.any(Object),
    );
  });

  it("fetches point persons with the Authorization header when logged in", async () => {
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/active"),
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("fetches point persons without an Authorization header when not logged in", async () => {
    mockCookiesGet.mockReturnValue(undefined);
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/active"),
      expect.objectContaining({ headers: {} }),
    );
  });

  it("passes point persons to the form", async () => {
    render(await CreateGrievance());
    expect(screen.getByText("Walter Reuther")).toBeInTheDocument();
    expect(screen.getByText("Cesar Chavez")).toBeInTheDocument();
  });

  it("fetches the current user from the /users/me endpoint", async () => {
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/me"),
      expect.any(Object),
    );
  });

  it("fetches the current user with the Authorization header when logged in", async () => {
    render(await CreateGrievance());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/me"),
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("passes the current user's ID as the default point person", async () => {
    render(await CreateGrievance());
    expect(screen.getByTestId("default-point-person-id")).toHaveTextContent(
      "2",
    );
  });

  it("passes a point persons error to the form when the /users/active fetch fails", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/users/active")) {
        return Promise.resolve({ ok: false });
      }
      if (url.includes("/users/me")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCurrentUser),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });
    });
    render(await CreateGrievance());
    expect(screen.getByTestId("point-persons-error")).toBeInTheDocument();
  });

  it("passes no point persons to the form when the /users/active fetch fails", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/users/active")) {
        return Promise.resolve({ ok: false });
      }
      if (url.includes("/users/me")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCurrentUser),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });
    });
    render(await CreateGrievance());
    expect(screen.queryByText("Walter Reuther")).not.toBeInTheDocument();
    expect(screen.queryByText("Cesar Chavez")).not.toBeInTheDocument();
  });
});
