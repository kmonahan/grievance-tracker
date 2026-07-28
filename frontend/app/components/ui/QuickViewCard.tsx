import type { JSX, PropsWithChildren } from "react";
import FancyLink from "~/app/components/ui/FancyLink";

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
          <FancyLink {...link} />
        </footer>
      ) : null}
    </section>
  );
}
