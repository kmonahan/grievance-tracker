import Link from "next/link";
import type { JSX } from "react";

export interface FancyLinkProps {
  text: string;
  href: string;
}

export default function FancyLink({ text, href }: FancyLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      className="font-subtitle text-base font-semibold text-primary hover focus inline-flex items-center gap-2 group"
    >
      {text}
      <svg
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="presentation"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
