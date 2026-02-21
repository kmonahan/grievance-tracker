import { isLoggedIn } from "./auth";

const mockCookiesGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookiesGet })),
}));

describe("isLoggedIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when the access_token cookie is present", async () => {
    mockCookiesGet.mockReturnValue({ value: "my-access-token" });

    expect(await isLoggedIn()).toBe(true);
  });

  it("returns false when the access_token cookie is absent", async () => {
    mockCookiesGet.mockReturnValue(undefined);

    expect(await isLoggedIn()).toBe(false);
  });
});
