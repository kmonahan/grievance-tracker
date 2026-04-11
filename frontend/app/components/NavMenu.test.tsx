import { fireEvent, render, screen } from "@testing-library/react";
import NavMenu from "./NavMenu";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
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

import { usePathname } from "next/navigation";

describe("NavMenu", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders the hamburger button", () => {
    render(<NavMenu />);
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("mobile menu is not visible initially", () => {
    render(<NavMenu />);
    expect(document.querySelector("#mobile-nav")).not.toBeInTheDocument();
  });

  describe("when the hamburger button is clicked", () => {
    it("opens the mobile menu", () => {
      render(<NavMenu />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      expect(document.querySelector("#mobile-nav")).toBeInTheDocument();
    });

    it("changes button label to Close menu", () => {
      render(<NavMenu />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      expect(
        screen.getByRole("button", { name: "Close menu" }),
      ).toBeInTheDocument();
    });

    it("sets aria-expanded to true", () => {
      render(<NavMenu />);
      const button = screen.getByRole("button", { name: "Open menu" });
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("renders nav links in the mobile menu", () => {
      render(<NavMenu />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      const mobileNav = document.querySelector("#mobile-nav");
      expect(mobileNav).toBeInTheDocument();
      expect(mobileNav).toHaveTextContent("Home");
      expect(mobileNav).toHaveTextContent("Add Grievance");
      expect(mobileNav).toHaveTextContent("Log Out");
    });

    describe("and clicked again", () => {
      it("closes the mobile menu", () => {
        render(<NavMenu />);
        const button = screen.getByRole("button", { name: "Open menu" });
        fireEvent.click(button);
        fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
        expect(document.querySelector("#mobile-nav")).not.toBeInTheDocument();
      });
    });
  });

  describe("when the route changes", () => {
    it("closes the mobile menu", () => {
      const { rerender } = render(<NavMenu />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      expect(document.querySelector("#mobile-nav")).toBeInTheDocument();

      (usePathname as jest.Mock).mockReturnValue("/grievances/create");
      rerender(<NavMenu />);

      expect(document.querySelector("#mobile-nav")).not.toBeInTheDocument();
    });
  });

  describe("desktop nav links", () => {
    it("renders a Home link", () => {
      render(<NavMenu />);
      const homeLinks = screen.getAllByRole("link", { name: "Home" });
      expect(homeLinks.length).toBeGreaterThanOrEqual(1);
      expect(homeLinks[0]).toHaveAttribute("href", "/");
    });

    it("renders an Add Grievance link", () => {
      render(<NavMenu />);
      const addLinks = screen.getAllByRole("link", { name: "Add Grievance" });
      expect(addLinks.length).toBeGreaterThanOrEqual(1);
      expect(addLinks[0]).toHaveAttribute("href", "/grievances/create");
    });

    it("renders a Log Out link to /logout", () => {
      render(<NavMenu />);
      const logoutLinks = screen.getAllByRole("link", { name: "Log Out" });
      expect(logoutLinks.length).toBeGreaterThanOrEqual(1);
      expect(logoutLinks[0]).toHaveAttribute("href", "/logout");
    });
  });
});
