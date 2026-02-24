import { render, screen } from "@testing-library/react";
import CreateGrievance from "./page";

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "Link";
  return MockLink;
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
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(
      screen.getByRole("heading", { name: "Create New Grievance" }),
    ).toBeInTheDocument();
  });

  it("renders the Name field", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the Description field", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("renders the Category select", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("renders categories fetched from the backend as options", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByRole("option", { name: "Pay" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PTO" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Health & Safety" }),
    ).toBeInTheDocument();
  });

  it("renders category options with the category id as the value", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByRole("option", { name: "Pay" })).toHaveValue("1");
    expect(screen.getByRole("option", { name: "PTO" })).toHaveValue("2");
  });

  it("renders no category options when the fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    const categorySelect = screen.getByLabelText("Category");
    // Only the empty default option should be present
    expect(categorySelect.querySelectorAll("option")).toHaveLength(1);
  });

  it("fetches categories with the 'categories' cache tag", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.objectContaining({ next: { tags: ["categories"] } }),
    );
  });

  it("fetches categories with the Authorization header when logged in", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("fetches categories without an Authorization header when not logged in", async () => {
    mockCookiesGet.mockReturnValue(undefined);
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.objectContaining({ headers: {} }),
    );
  });

  it("renders the Add Category link", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(
      screen.getByRole("link", { name: "+ Add Category" }),
    ).toBeInTheDocument();
  });

  it("renders the Point Person select", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByLabelText("Point Person")).toBeInTheDocument();
  });

  it("renders the submit button", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("pre-selects the category when selectedCategory search param is provided", async () => {
    render(
      await CreateGrievance({
        searchParams: Promise.resolve({ selectedCategory: "2" }),
      }),
    );
    expect(screen.getByLabelText("Category")).toHaveValue("2");
  });

  it("does not pre-select a category when no selectedCategory param is provided", async () => {
    render(await CreateGrievance({ searchParams: Promise.resolve({}) }));
    expect(screen.getByLabelText("Category")).toHaveValue("");
  });
});
