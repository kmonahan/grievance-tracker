import Link from "next/link";
import type { JSX, PropsWithChildren } from "react";

export interface QuickViewCardProps {
  title: string;
  description?: string;
  link?: {
    text: string;
    href: string;
  };
}

export default function QuickViewCard({
  title,
  description,
  link,
  children,
}: PropsWithChildren<QuickViewCardProps>): JSX.Element {
  return (
    <section className="flex flex-col gap-6 bg-card text-primary rounded-xl border py-6 border-primary/20 shadow-lg">
      <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 border-b">
        <h2 className="font-bold font-title text-2xl md:text-3xl uppercase text-primary">
          {title}
        </h2>
        {description ? (
          <div className="text-muted-foreground text-base font-subtitle">
            {description}
          </div>
        ) : null}
      </div>
      {children}
      {link ? (
        <footer className="mt-6 flex justify-center">
          <Link
            href={link.href}
            className="font-subtitle text-base font-semibold text-primary hover focus inline-flex items-center gap-2 group"
          >
            {link.text}
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
        </footer>
      ) : null}
    </section>
  );
}
