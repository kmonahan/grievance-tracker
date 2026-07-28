import type { JSX, PropsWithChildren, ReactNode } from "react";

export interface FiltersGroupProps {
  legend: ReactNode;
  showLegend?: boolean;
}

export default function FiltersGroup({
  legend,
  showLegend = true,
  children,
}: PropsWithChildren<FiltersGroupProps>): JSX.Element {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend
        className={
          showLegend
            ? `mb-1.5 font-subtitle text-xs font-medium uppercase tracking-wide text-muted-foreground`
            : "sr-only"
        }
      >
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
