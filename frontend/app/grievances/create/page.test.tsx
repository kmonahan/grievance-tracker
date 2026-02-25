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
  }: {
    categories: { id: number; name: string }[];
    pointPersons: string[];
  }) => (
    <div>
      <h1>Create New Grievance</h1>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <ul>
        {pointPersons.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
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
