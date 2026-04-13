"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/grievances/create", label: "Add Grievance" },
];

const linkClassName =
  "font-body text-base text-muted-foreground tracking-wide hover:text-primary transition-colors";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is intentionally watched to close the menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav aria-label="Main navigation">
      {/* Hamburger button — mobile only */}
      <button
        type="button"
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 text-primary cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span
          className={`block w-6 h-0.5 bg-current transition-all duration-200 ${isOpen ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`block w-6 h-0.5 bg-current transition-all duration-200 ${isOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-6 h-0.5 bg-current transition-all duration-200 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {/* Desktop nav — hidden on mobile */}
      <ul
        className="hidden md:flex items-center gap-6"
        aria-label="Navigation links"
      >
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={linkClassName}>
              {label}
            </Link>
          </li>
        ))}
        <li>
          <a href="/logout" className={linkClassName}>
            Log Out
          </a>
        </li>
      </ul>

      {/* Mobile dropdown — full width below the header */}
      {isOpen && (
        <ul
          id="mobile-nav"
          className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-md z-50"
        >
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`block px-5 py-4 ${linkClassName}`}>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a href="/logout" className={`block px-5 py-4 ${linkClassName}`}>
              Log Out
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
