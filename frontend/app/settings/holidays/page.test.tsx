import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useActionState } from "react";
import HolidayRow from "./HolidayRow";
import HolidaysPage from "./page";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), refresh: mockRefresh })),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

const mockCreateHoliday = jest.fn();
const mockEditHoliday = jest.fn();
const mockDeleteHoliday = jest.fn();
jest.mock("./actions", () => ({
  createHoliday: (...args: unknown[]) => mockCreateHoliday(...args),
  editHoliday: (...args: unknown[]) => mockEditHoliday(...args),
  deleteHoliday: (...args: unknown[]) => mockDeleteHoliday(...args),
}));

const mockAction = jest.fn();
const emptyState = { error: null, errors: null, fields: {} };

const HOLIDAY_A = { id: 1, name: "New Year's Day", date: "2025-01-01" };
const HOLIDAY_B = { id: 2, name: "Independence Day", date: "2025-07-04" };

function mockFetchHolidays(holidays: (typeof HOLIDAY_A)[]) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => holidays,
  });
}

async function renderPage() {
  const jsx = await HolidaysPage();
  return render(jsx);
}

beforeEach(() => {
  process.env.BACKEND_URL = "http://localhost:8000";
  jest.clearAllMocks();
  mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  (useActionState as jest.Mock).mockReturnValue([emptyState, mockAction]);
  mockDeleteHoliday.mockResolvedValue({ ok: true });
});

// ──────────────────────────────────────────────────────────────────────────────
// HolidaysPage – server component
// ──────────────────────────────────────────────────────────────────────────────

describe("HolidaysPage", () => {
  it("fetches from /holidays with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchHolidays([HOLIDAY_A]);
    await HolidaysPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/holidays",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("renders the page heading", async () => {
    mockFetchHolidays([HOLIDAY_A]);
    await renderPage();
    expect(
      screen.getByRole("heading", { name: /holidays/i }),
    ).toBeInTheDocument();
  });

  it("renders each holiday's name", async () => {
    mockFetchHolidays([HOLIDAY_A, HOLIDAY_B]);
    await renderPage();
    expect(screen.getByText("New Year's Day")).toBeInTheDocument();
    expect(screen.getByText("Independence Day")).toBeInTheDocument();
  });

  it("renders each holiday's date", async () => {
    mockFetchHolidays([HOLIDAY_A]);
    await renderPage();
    expect(screen.getByText("2025-01-01")).toBeInTheDocument();
  });

  it("renders an empty state when there are no holidays", async () => {
    mockFetchHolidays([]);
    await renderPage();
    expect(screen.getByText(/no holidays/i)).toBeInTheDocument();
  });

  it("renders an 'Add holiday' button", async () => {
    mockFetchHolidays([HOLIDAY_A]);
    await renderPage();
    expect(
      screen.getByRole("button", { name: /add holiday/i }),
    ).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// HolidayRow – client component (edit & delete interactions)
// ──────────────────────────────────────────────────────────────────────────────

describe("HolidayRow – display", () => {
  it("renders the holiday name", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    expect(screen.getByText("New Year's Day")).toBeInTheDocument();
  });

  it("renders the holiday date", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    expect(screen.getByText("2025-01-01")).toBeInTheDocument();
  });

  it("renders an 'Edit' button", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("renders a 'Delete' button", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});

describe("HolidayRow – edit flow", () => {
  it("opens an edit form when the 'Edit' button is clicked", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it("prefills the name field with the holiday's current name", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/name/i)).toHaveValue("New Year's Day");
  });

  it("prefills the date field with the holiday's current date", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/date/i)).toHaveValue("2025-01-01");
  });

  it("renders a 'Save' button inside the edit form", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders a 'Cancel' button inside the edit form", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("closes the edit form when 'Cancel' is clicked", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it("wires useActionState to editHoliday for the edit form", () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(useActionState).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ error: null }),
    );
  });

  it("displays a general error when state has an error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Invalid date", errors: null, fields: {} },
      mockAction,
    ]);
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByText("Invalid date")).toBeInTheDocument();
  });

  it("closes the edit form after a successful submission", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: null, errors: null, fields: {}, success: true },
      mockAction,
    ]);
    render(<HolidayRow holiday={HOLIDAY_A} />);
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it("preserves field values from state on error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: "Invalid date",
        errors: null,
        fields: { name: "Edited Name", date: "2025-01-02" },
      },
      mockAction,
    ]);
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/name/i)).toHaveValue("Edited Name");
    expect(screen.getByLabelText(/date/i)).toHaveValue("2025-01-02");
  });
});

describe("HolidayRow – delete flow", () => {
  it("calls deleteHoliday with the holiday id when 'Delete' is clicked", async () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(mockDeleteHoliday).toHaveBeenCalledWith(1);
    });
  });

  it("refreshes the router after a successful delete", async () => {
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("does not refresh the router when delete fails", async () => {
    mockDeleteHoliday.mockResolvedValueOnce({ ok: false });
    render(<HolidayRow holiday={HOLIDAY_A} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(mockDeleteHoliday).toHaveBeenCalled();
    });
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Add-holiday form (rendered inline on the page or via a modal/drawer)
// ──────────────────────────────────────────────────────────────────────────────

describe("HolidaysPage – add holiday form", () => {
  it("does not show the add form before the button is clicked", async () => {
    mockFetchHolidays([]);
    await renderPage();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it("shows the add form after clicking 'Add holiday'", async () => {
    mockFetchHolidays([]);
    await renderPage();
    fireEvent.click(screen.getByRole("button", { name: /add holiday/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it("renders a submit button inside the add form", async () => {
    mockFetchHolidays([]);
    await renderPage();
    fireEvent.click(screen.getByRole("button", { name: /add holiday/i }));
    expect(
      screen.getByRole("button", { name: /save|add|create/i }),
    ).toBeInTheDocument();
  });

  it("wires useActionState to createHoliday for the add form", async () => {
    mockFetchHolidays([]);
    await renderPage();
    fireEvent.click(screen.getByRole("button", { name: /add holiday/i }));
    expect(useActionState).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ error: null }),
    );
  });

  it("closes the add form and refreshes the router after a successful submission", async () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: null, errors: null, fields: {}, success: true },
      mockAction,
    ]);
    mockFetchHolidays([]);
    await renderPage();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });
});
