"use client";

import { useMemo, useState } from "react";
import { GrievanceCard } from "~/app/components/GrievanceCard";
import { FILTER_STEPS, isClosed } from "~/app/grievances/constants";
import type { Grievance } from "~/app/grievances/types";

function filterButtonClass(active: boolean): string {
  return `rounded-lg border px-3 py-1.5 font-subtitle text-sm font-medium transition-colors ${
    active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
  }`;
}

function getLatestStep(grievance: Grievance): string | null {
  return grievance.escalations.at(-1)?.step ?? null;
}

function getFiledYear(grievance: Grievance): number | null {
  const first = grievance.escalations.at(0);
  if (!first) return null;
  return new Date(first.date).getFullYear();
}

function hasAnyMissedDeadline(grievance: Grievance): boolean {
  return grievance.escalations.some((e) => e.deadline_missed);
}

interface GrievanceFilterViewProps {
  grievances: Grievance[];
}

export function GrievanceFilterView({
  grievances,
}: GrievanceFilterViewProps): React.ReactElement {
  const currentYear = new Date().getFullYear();

  const [showClosed, setShowClosed] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentYearOnly, setCurrentYearOnly] = useState(false);
  const [missedDeadlineOnly, setMissedDeadlineOnly] = useState(false);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const g of grievances) {
      if (g.category) seen.add(g.category);
    }
    return Array.from(seen).sort();
  }, [grievances]);

  const [openGrievances, closedGrievances] = useMemo(() => {
    const open: Grievance[] = [];
    const closed: Grievance[] = [];
    for (const g of grievances) {
      (isClosed(g) ? closed : open).push(g);
    }
    return [open, closed] as const;
  }, [grievances]);

  function applyFilters(list: Grievance[]): Grievance[] {
    return list.filter((g) => {
      if (activeStep !== null && getLatestStep(g) !== activeStep) return false;
      if (activeCategory !== null && g.category !== activeCategory)
        return false;
      if (currentYearOnly && getFiledYear(g) !== currentYear) return false;
      if (missedDeadlineOnly && !hasAnyMissedDeadline(g)) return false;
      return true;
    });
  }

  const filteredOpen = applyFilters(openGrievances);
  const filteredClosed = applyFilters(closedGrievances);

  const activeFilterCount = [
    activeStep !== null,
    activeCategory !== null,
    currentYearOnly,
    missedDeadlineOnly,
  ].filter(Boolean).length;

  function clearAllFilters() {
    setActiveStep(null);
    setActiveCategory(null);
    setCurrentYearOnly(false);
    setMissedDeadlineOnly(false);
  }

  return (
    <div>
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
          <span className="font-subtitle text-sm font-semibold text-foreground">
            Filters
          </span>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-subtitle text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              role="switch"
              aria-checked={showClosed}
              onClick={() => setShowClosed((v) => !v)}
              className={`inline-flex items-center gap-2 ${filterButtonClass(showClosed)}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                {showClosed ? (
                  <path
                    fillRule="evenodd"
                    d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135A3.001 3.001 0 0 0 8 5.5c-.476 0-.93.11-1.333.307l.809.808Z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              {showClosed
                ? `Hide closed (${closedGrievances.length})`
                : `Show closed (${closedGrievances.length})`}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <fieldset className="border-0 p-0 m-0">
            <legend className="mb-1.5 font-subtitle text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Step
            </legend>
            <div className="flex flex-wrap gap-2">
              {FILTER_STEPS.map((step) => (
                <button
                  key={step.value}
                  type="button"
                  aria-pressed={activeStep === step.value}
                  onClick={() =>
                    setActiveStep(activeStep === step.value ? null : step.value)
                  }
                  className={filterButtonClass(activeStep === step.value)}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </fieldset>

          {categories.length > 0 && (
            <fieldset className="border-0 p-0 m-0">
              <legend className="mb-1.5 font-subtitle text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </legend>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={activeCategory === cat}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat ? null : cat)
                    }
                    className={filterButtonClass(activeCategory === cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">Additional filters</legend>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={currentYearOnly}
                onClick={() => setCurrentYearOnly((v) => !v)}
                className={`inline-flex items-center gap-2 ${filterButtonClass(currentYearOnly)}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3h.25A2.75 2.75 0 0 1 15 5.75v7.5A2.75 2.75 0 0 1 12.25 16H3.75A2.75 2.75 0 0 1 1 13.25v-7.5A2.75 2.75 0 0 1 3.75 3H4V1.75ZM3.75 6a1.25 1.25 0 0 0-1.25 1.25v6c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-6c0-.69-.56-1.25-1.25-1.25H3.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                {currentYear} only
              </button>

              <button
                type="button"
                role="switch"
                aria-checked={missedDeadlineOnly}
                onClick={() => setMissedDeadlineOnly((v) => !v)}
                className={`inline-flex items-center gap-2 ${filterButtonClass(missedDeadlineOnly)}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                Missed deadline
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      {filteredOpen.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-12 text-center">
          <p className="font-subtitle text-base font-semibold text-muted-foreground">
            No grievances match these filters.
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-2 font-subtitle text-sm text-muted-foreground underline hover:text-foreground transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ol className="space-y-3">
          {filteredOpen.map((grievance) => (
            <li key={grievance.id}>
              <GrievanceCard grievance={grievance} />
            </li>
          ))}
        </ol>
      )}

      {showClosed && (
        <section className="mt-10">
          <h2 className="mb-4 font-subtitle text-lg font-semibold text-muted-foreground">
            Closed ({closedGrievances.length})
          </h2>
          {filteredClosed.length > 0 ? (
            <ol className="space-y-3">
              {filteredClosed.map((grievance) => (
                <li key={grievance.id}>
                  <GrievanceCard grievance={grievance} muted />
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-10 text-center">
              <p className="text-base text-muted-foreground">
                {activeFilterCount > 0
                  ? "No closed grievances match these filters."
                  : "No closed grievances."}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
