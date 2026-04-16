"use client";

import { useState } from "react";
import { GrievanceCard } from "~/app/components/GrievanceCard";
import type { Grievance } from "~/app/grievances/types";

const STEPS = [
  { label: "Step 1", value: "Step #1" },
  { label: "Step 2", value: "Step #2" },
  { label: "Step 3", value: "Step #3" },
];

interface StepFilterViewProps {
  openGrievances: Grievance[];
  closedGrievances: Grievance[];
  showClosed: boolean;
}

export function StepFilterView({
  openGrievances,
  closedGrievances,
  showClosed,
}: StepFilterViewProps): React.ReactElement {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  function getLatestStep(grievance: Grievance): string | null {
    const latest = grievance.escalations.at(-1);
    return latest?.step ?? null;
  }

  const filteredOpen =
    activeStep === null
      ? openGrievances
      : openGrievances.filter((g) => getLatestStep(g) === activeStep);

  const filteredClosed =
    activeStep === null
      ? closedGrievances
      : closedGrievances.filter((g) => getLatestStep(g) === activeStep);

  const visibleClosed = showClosed ? filteredClosed : [];

  return (
    <div>
      {/* Step filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={activeStep === null}
          onClick={() => setActiveStep(null)}
          className={`rounded-lg border px-3 py-1.5 font-subtitle text-sm font-medium transition-colors ${
            activeStep === null
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
        >
          All
        </button>
        {STEPS.map((step) => (
          <button
            key={step.value}
            type="button"
            aria-pressed={activeStep === step.value}
            onClick={() => setActiveStep(step.value)}
            className={`rounded-lg border px-3 py-1.5 font-subtitle text-sm font-medium transition-colors ${
              activeStep === step.value
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Open grievances list */}
      {filteredOpen.length === 0 && activeStep !== null ? (
        <p className="text-base text-muted-foreground">
          No grievances at this step.
        </p>
      ) : (
        <ol className="space-y-3">
          {filteredOpen.map((grievance) => (
            <li key={grievance.id}>
              <GrievanceCard grievance={grievance} />
            </li>
          ))}
        </ol>
      )}

      {/* Closed grievances section */}
      {showClosed && (
        <section className="mt-10">
          <h2 className="mb-4 font-subtitle text-lg font-semibold text-muted-foreground">
            Closed ({closedGrievances.length})
          </h2>
          {visibleClosed.length > 0 ? (
            <ol className="space-y-3">
              {visibleClosed.map((grievance) => (
                <li key={grievance.id}>
                  <GrievanceCard grievance={grievance} muted />
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-10 text-center">
              <p className="text-base text-muted-foreground">
                No closed grievances.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
