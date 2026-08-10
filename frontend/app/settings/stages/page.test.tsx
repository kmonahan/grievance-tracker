import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import StagesPage from "./page";
import StageRow from "./StageRow";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

const mockEditStage = jest.fn();
jest.mock("./actions", () => ({
  editStage: (...args: unknown[]) => mockEditStage(...args),
}));

const mockAction = jest.fn();
const emptyState = { error: null, errors: null, fields: {} };

const STAGE_A = {
  step: "Step #1",
  status: "Waiting to Schedule",
  num_days: 10,
  day_type: 1,
};
const STAGE_B = {
  step: "Step #2",
  status: "Scheduled",
  num_days: 5,
  day_type: 2,
};
const STAGE_NO_DUE_DATE = {
  step: "Step #3",
  status: "Resolved",
  num_days: null,
  day_type: null,
};

function mockFetchStages(
  stages: (typeof STAGE_A | typeof STAGE_NO_DUE_DATE)[],
) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => stages,
  });
}

async function renderPage() {
  const jsx = await StagesPage();
  return render(jsx);
}

beforeEach(() => {
  process.env.BACKEND_URL = "http://localhost:8000";
  jest.clearAllMocks();
  mockCookiesGet.mockReturnValue({ value: "test-access-token" });
  (useActionState as jest.Mock).mockReturnValue([emptyState, mockAction]);
});

// ──────────────────────────────────────────────────────────────────────────────
// StagesPage – server component
// ──────────────────────────────────────────────────────────────────────────────

describe("StagesPage", () => {
  it("fetches from /stages with the access token", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-token" });
    mockFetchStages([STAGE_A]);
    await StagesPage();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/stages",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-token" },
      }),
    );
  });

  it("renders the page heading", async () => {
    mockFetchStages([STAGE_A]);
    await renderPage();
    expect(
      screen.getByRole("heading", { name: /stages/i }),
    ).toBeInTheDocument();
  });

  it("renders each stage's step and status", async () => {
    mockFetchStages([STAGE_A, STAGE_B]);
    await renderPage();
    expect(
      screen.getByText(/Step #1.*Waiting to Schedule/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Step #2.*Scheduled/)).toBeInTheDocument();
  });

  it("renders each stage's number of days and day type", async () => {
    mockFetchStages([STAGE_A]);
    await renderPage();
    expect(screen.getByText(/10 Working days/)).toBeInTheDocument();
  });

  it("renders 'No due date' when num_days is null", async () => {
    mockFetchStages([STAGE_NO_DUE_DATE]);
    await renderPage();
    expect(screen.getByText(/no due date/i)).toBeInTheDocument();
  });

  it("renders an empty state when there are no stages", async () => {
    mockFetchStages([]);
    await renderPage();
    expect(screen.getByText(/no stages/i)).toBeInTheDocument();
  });

  it("does not render an 'Add' button", async () => {
    mockFetchStages([STAGE_A]);
    await renderPage();
    expect(
      screen.queryByRole("button", { name: /add stage/i }),
    ).not.toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// StageRow – client component (edit interactions)
// ──────────────────────────────────────────────────────────────────────────────

describe("StageRow – display", () => {
  it("renders the step and status", () => {
    render(<StageRow stage={STAGE_A} />);
    expect(
      screen.getByText(/Step #1.*Waiting to Schedule/),
    ).toBeInTheDocument();
  });

  it("renders an 'Edit' button", () => {
    render(<StageRow stage={STAGE_A} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("does not render a 'Delete' button", () => {
    render(<StageRow stage={STAGE_A} />);
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });
});

describe("StageRow – edit flow", () => {
  it("opens an edit form when the 'Edit' button is clicked", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/number of days/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/day type/i)).toBeInTheDocument();
  });

  it("prefills the number of days field with the stage's current value", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/number of days/i)).toHaveValue(10);
  });

  it("prefills the day type field with the stage's current value", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/day type/i)).toHaveValue("1");
  });

  it("does not render step or status as editable fields", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.queryByLabelText(/^step$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^status$/i)).not.toBeInTheDocument();
  });

  it("renders a 'Save' button inside the edit form", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders a 'Cancel' button inside the edit form", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("closes the edit form when 'Cancel' is clicked", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByLabelText(/number of days/i)).not.toBeInTheDocument();
  });

  it("wires useActionState to editStage bound to the stage's step and status", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(useActionState).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ error: null }),
    );
  });

  it("displays a general error when state has an error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: "Invalid value", errors: null, fields: {} },
      mockAction,
    ]);
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
  });

  it("closes the edit form after a successful submission", () => {
    (useActionState as jest.Mock).mockReturnValue([
      { error: null, errors: null, fields: {}, success: true },
      mockAction,
    ]);
    render(<StageRow stage={STAGE_A} />);
    expect(screen.queryByLabelText(/number of days/i)).not.toBeInTheDocument();
  });

  it("preserves field values from state on error", () => {
    (useActionState as jest.Mock).mockReturnValue([
      {
        error: "Invalid value",
        errors: null,
        fields: { num_days: "20", day_type: "2" },
      },
      mockAction,
    ]);
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByLabelText(/number of days/i)).toHaveValue(20);
    expect(screen.getByLabelText(/day type/i)).toHaveValue("2");
  });

  it("includes hidden step and status fields for submission", () => {
    render(<StageRow stage={STAGE_A} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    const form = screen.getByRole("button", { name: /save/i }).closest("form");
    expect(form?.querySelector('input[name="step"]')).toHaveValue("Step #1");
    expect(form?.querySelector('input[name="status"]')).toHaveValue(
      "Waiting to Schedule",
    );
  });
});
