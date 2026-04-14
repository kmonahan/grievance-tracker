"use client";

import { useState } from "react";
import { GrievanceCard } from "~/app/components/GrievanceCard";
import type { Grievance } from "~/app/grievances/types";

const STEPS = [
  { display: "Step #1", shortDisplay: "Step 1" },
  { display: "Step #2", shortDisplay: "Step 2" },
  { display: "Step #3", shortDisplay: "Step 3" },
] as const;

type StepDisplay = (typeof STEPS)[number]["display"];

function getGrievancesForStep(
  grievances: Grievance[],
  stepDisplay: StepDisplay,
): Grievance[] {
  return grievances.filter((g) => g.escalations.at(-1)?.step === stepDisplay);
}

interface StepFilterViewProps {
  grievances: Grievance[];
}

export function StepFilterView({ grievances }: StepFilterViewProps) {
  const [activeStep, setActiveStep] = useState<StepDisplay | null>(null);

  const stepsToShow = activeStep
    ? STEPS.filter((s) => s.display === activeStep)
    : STEPS;

  return (
    <div>
      {/* Horizontally scrollable step filter pills */}
      <div className="-mx-5 mb-6 md:-mx-0">
        <fieldset className="flex gap-2 overflow-x-auto px-5 pb-1 md:px-0">
          <legend className="sr-only">Filter by step</legend>
          <button
            type="button"
            onClick={() => setActiveStep(null)}
            className={`shrink-0 rounded-full px-4 py-2 font-subtitle text-sm font-medium transition-colors ${
              activeStep === null
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
            aria-pressed={activeStep === null}
          >
            All
          </button>
          {STEPS.map((step) => (
            <button
              key={step.display}
              type="button"
              onClick={() => setActiveStep(step.display)}
              className={`shrink-0 rounded-full px-4 py-2 font-subtitle text-sm font-medium transition-colors ${
                activeStep === step.display
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
              aria-pressed={activeStep === step.display}
            >
              {step.shortDisplay}
            </button>
          ))}
        </fieldset>
      </div>

      {/* Step sections */}
      <div className="space-y-8">
        {stepsToShow.map((step) => {
          const stepGrievances = getGrievancesForStep(grievances, step.display);
          return (
            <section key={step.display} aria-label={step.display}>
              <div className="mb-3 flex items-center gap-2.5">
                <h2 className="font-subtitle text-lg font-semibold text-foreground">
                  {step.display}
                </h2>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-subtitle text-sm font-medium text-muted-foreground">
                  {stepGrievances.length}
                </span>
              </div>
              {stepGrievances.length > 0 ? (
                <ol className="space-y-3">
                  {stepGrievances.map((grievance) => (
                    <li key={grievance.id}>
                      <GrievanceCard grievance={grievance} />
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card px-5 py-6">
                  <p className="text-sm text-muted-foreground">
                    No grievances at this step.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
