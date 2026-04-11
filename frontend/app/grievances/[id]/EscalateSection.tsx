"use client";

import { useActionState, useState } from "react";
import {
  ALWAYS_AVAILABLE,
  STATE_SEQUENCE,
  STATUS_DISPLAY_TO_ENUM,
  STATUS_STYLES,
  STEP_DISPLAY_TO_ENUM,
} from "~/app/grievances/constants";
import { escalateGrievance } from "~/app/grievances/escalateAction";
import type {
  Grievance,
  OptionStyle,
  StepStatus,
} from "~/app/grievances/types";

const DEFAULT_OPTION_STYLE: OptionStyle = {
  ...STATUS_STYLES.WAITING_TO_SCHEDULE,
  icon: null,
};

function toStepStatus(escalation: {
  step: string;
  status: string;
}): StepStatus {
  return {
    stepEnum: STEP_DISPLAY_TO_ENUM[escalation.step] ?? escalation.step,
    stepDisplay: escalation.step,
    statusEnum: STATUS_DISPLAY_TO_ENUM[escalation.status] ?? escalation.status,
    statusDisplay: escalation.status,
  };
}

function buildOptions(grievance: Grievance): StepStatus[] {
  if (grievance.escalations.length === 0) return [];

  const current = toStepStatus(
    grievance.escalations[grievance.escalations.length - 1],
  );
  const options: StepStatus[] = [];

  // Next option in the state machine
  const currentIdx = STATE_SEQUENCE.findIndex(
    (s) =>
      s.stepEnum === current.stepEnum && s.statusEnum === current.statusEnum,
  );
  if (currentIdx !== -1 && currentIdx < STATE_SEQUENCE.length - 1) {
    options.push(STATE_SEQUENCE[currentIdx + 1]);
  }

  // Always-available terminal statuses (excluding the current)
  for (const aa of ALWAYS_AVAILABLE) {
    if (aa.statusEnum !== current.statusEnum) {
      options.push({
        ...aa,
        stepEnum: current.stepEnum,
        stepDisplay: current.stepDisplay,
      });
    }
  }

  // Previous state (second-to-last escalation) goes last
  if (grievance.escalations.length >= 2) {
    options.push(
      toStepStatus(grievance.escalations[grievance.escalations.length - 2]),
    );
  }

  return options;
}

type Selected = { stepEnum: string; statusEnum: string };

export function EscalateSection({ grievance }: { grievance: Grievance }) {
  const [, formAction] = useActionState(escalateGrievance, { error: null });
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [hearingDate, setHearingDate] = useState("");

  const options = buildOptions(grievance);

  return (
    <section className="border-t">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-4 py-5 sm:px-6 transition-colors hover:bg-muted/40"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-subtitle text-xl font-semibold">Escalate</h2>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-5 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <form action={formAction}>
            <input
              type="hidden"
              name="grievance_id"
              value={grievance.id.toString()}
            />
            {selected && (
              <>
                <input type="hidden" name="step" value={selected.stepEnum} />
                <input
                  type="hidden"
                  name="status"
                  value={selected.statusEnum}
                />
              </>
            )}

            <fieldset>
              <legend className="sr-only">Select new status</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {options.map((opt) => {
                  const isSelected =
                    selected?.stepEnum === opt.stepEnum &&
                    selected?.statusEnum === opt.statusEnum;
                  const style =
                    STATUS_STYLES[opt.statusEnum] ?? DEFAULT_OPTION_STYLE;
                  return (
                    <label
                      key={`${opt.stepEnum}-${opt.statusEnum}`}
                      className={`flex flex-col cursor-pointer gap-2 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? style.selectedClasses
                          : "border-border hover:border-muted-foreground/30 hover:bg-muted/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="escalation-status"
                        value={opt.statusEnum}
                        checked={isSelected}
                        onChange={() => {
                          setSelected({
                            stepEnum: opt.stepEnum,
                            statusEnum: opt.statusEnum,
                          });
                          if (opt.statusEnum !== "SCHEDULED")
                            setHearingDate("");
                        }}
                        className="sr-only"
                      />
                      <div className="flex flex-1 items-center gap-2">
                        {style.icon && (
                          <span
                            className="flex h-10 w-10 shrink-0 items-center text-3xl"
                            aria-hidden="true"
                          >
                            {style.icon}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-base font-medium ${style.badgeClasses}`}
                        >
                          {opt.statusDisplay}
                        </span>
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-4 text-teal-600"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="mt-1 text-right text-sm text-muted-foreground">
                        {opt.stepDisplay}
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {selected?.statusEnum === "SCHEDULED" && (
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-500/5 p-4">
                <label
                  htmlFor="hearing-date"
                  className="font-subtitle text-sm font-semibold text-teal-600"
                >
                  Hearing Date
                </label>
                <input
                  id="hearing-date"
                  name="hearing_date"
                  type="date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-base text-foreground shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 sm:max-w-xs"
                />
              </div>
            )}

            {selected && (
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-subtitle text-base font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={selected.statusEnum === "SCHEDULED" && !hearingDate}
                >
                  Submit Escalation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setHearingDate("");
                  }}
                  className="rounded-md px-4 py-2.5 font-subtitle text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
