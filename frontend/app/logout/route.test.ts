import { GET } from "./route";

global.fetch = jest.fn();

const mockCookiesGet = jest.fn();
const mockCookiesDelete = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() =>
    Promise.resolve({ get: mockCookiesGet, delete: mockCookiesDelete }),
  ),
}));

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (path: string) => mockRedirect(path),
}));

describe("GET /logout", () => {
  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8000";
  });

  describe("when both access_token and refresh_token are present", () => {
    beforeEach(() => {
      mockCookiesGet.mockImplementation((name: string) => {
        if (name === "access_token") return { value: "my-access-token" };
        if (name === "refresh_token") return { value: "my-refresh-token" };
        return undefined;
      });
      (fetch as jest.Mock).mockResolvedValue({ status: 204 });
    });

    it("sends a DELETE request to the backend with the Bearer token", async () => {
      await GET();

      expect(fetch).toHaveBeenCalledWith("http://localhost:8000/users/logout", {
        method: "DELETE",
        headers: { Authorization: "Bearer my-access-token" },
      });
    });

    it("deletes the access_token cookie", async () => {
      await GET();

      expect(mockCookiesDelete).toHaveBeenCalledWith("access_token");
    });

    it("deletes the refresh_token cookie", async () => {
      await GET();

      expect(mockCookiesDelete).toHaveBeenCalledWith("refresh_token");
    });

    it("redirects to the login page", async () => {
      await GET();

      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("when only the refresh_token is present", () => {
    beforeEach(() => {
      mockCookiesGet.mockImplementation((name: string) => {
        if (name === "refresh_token") return { value: "my-refresh-token" };
        return undefined;
      });
    });

    it("does not send a request to the backend", async () => {
      await GET();

      expect(fetch).not.toHaveBeenCalled();
    });

    it("deletes the refresh_token cookie", async () => {
      await GET();

      expect(mockCookiesDelete).toHaveBeenCalledWith("refresh_token");
    });

    it("does not delete the access_token cookie", async () => {
      await GET();

      expect(mockCookiesDelete).not.toHaveBeenCalledWith("access_token");
    });

    it("redirects to the login page", async () => {
      await GET();

      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("when neither cookie is present", () => {
    beforeEach(() => {
      mockCookiesGet.mockReturnValue(undefined);
    });

    it("does not send a request to the backend", async () => {
      await GET();

      expect(fetch).not.toHaveBeenCalled();
    });

    it("does not delete any cookies", async () => {
      await GET();

      expect(mockCookiesDelete).not.toHaveBeenCalled();
    });

    it("redirects to the login page", async () => {
      await GET();

      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
  });
});
