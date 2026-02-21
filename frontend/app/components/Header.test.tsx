import { render, screen } from "@testing-library/react";
import Header from "./Header";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = "Link";
  return MockLink;
});

import { cookies } from "next/headers";

function mockCookies(hasCookie: boolean) {
  (cookies as jest.Mock).mockResolvedValue({
    has: () => hasCookie,
  });
}

describe("Header", () => {
  it("renders the site title", async () => {
    mockCookies(false);
    render(await Header());
    expect(screen.getByText("BPL PSA Grievance Tracker")).toBeInTheDocument();
  });

  describe("when logged out", () => {
    beforeEach(() => {
      mockCookies(false);
    });

    it("does not render navigation", async () => {
      render(await Header());
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      mockCookies(true);
    });

    it("renders navigation", async () => {
      render(await Header());
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders a Home link", async () => {
      render(await Header());
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    });

    it("renders a Log Out link using an anchor tag to /logout", async () => {
      render(await Header());
      const logoutLink = screen.getByRole("link", { name: "Log Out" });
      expect(logoutLink).toBeInTheDocument();
      expect(logoutLink.tagName).toBe("A");
      expect(logoutLink).toHaveAttribute("href", "/logout");
    });
  });
});
