"use client";

import { useActionState, useState } from "react";
import ForwardCard from "~/app/components/FowardCard";
import GoBackOption from "~/app/components/GoBackOption";
import TerminalPill from "~/app/components/TerminalPill";
import Button from "~/app/components/ui/Button";
import FormField from "~/app/components/ui/FormField";
import {
  ALWAYS_AVAILABLE,
  STATE_SEQUENCE,
  STEP_DISPLAY_TO_ENUM,
} from "~/app/grievances/constants";
import { escalateGrievance } from "~/app/grievances/escalateAction";
import type { Grievance, StepStatus } from "~/app/grievances/types";
import { isValidStatus, StatusDisplayToEnum } from "../status";

function toStepStatus(escalation: {
  step: string;
  status: string;
}): StepStatus {
  const statusEntry =
    isValidStatus(escalation.status) &&
    Object.entries(StatusDisplayToEnum).find(
      ([_, val]) => val === escalation.status,
    );

  return {
    stepEnum: STEP_DISPLAY_TO_ENUM[escalation.step] ?? escalation.step,
    stepDisplay: escalation.step,
    statusEnum: statusEntry ? statusEntry[0] : escalation.status,
    statusDisplay: escalation.status,
  };
}

type OptionGroups = {
  forwardOptions: StepStatus[];
  terminalOptions: StepStatus[];
  previousOption: StepStatus | null;
};

function buildOptionGroups(grievance: Grievance): OptionGroups {
  if (grievance.escalations.length === 0) {
    return { forwardOptions: [], terminalOptions: [], previousOption: null };
  }

  const current = toStepStatus(
    grievance.escalations[grievance.escalations.length - 1],
  );
  const forwardOptions: StepStatus[] = [];
  const terminalOptions: StepStatus[] = [];
  let previousOption: StepStatus | null = null;

  const currentIdx = STATE_SEQUENCE.findIndex(
    (s) =>
      s.stepEnum === current.stepEnum && s.statusEnum === current.statusEnum,
  );

  if (currentIdx !== -1 && currentIdx < STATE_SEQUENCE.length - 1) {
    forwardOptions.push(STATE_SEQUENCE[currentIdx + 1]);
  }

  // When waiting to schedule, also offer skipping ahead past Scheduled
  if (current.statusEnum === "WAITING_TO_SCHEDULE" && currentIdx !== -1) {
    const prepStep = STATE_SEQUENCE.find(
      (s) =>
        s.stepEnum === current.stepEnum && s.statusEnum === "WAITING_TO_FILE",
    );
    if (prepStep) {
      forwardOptions.push(prepStep);
    }
  }

  // Always-available terminal statuses (excluding the current)
  for (const aa of ALWAYS_AVAILABLE) {
    if (aa.statusEnum !== current.statusEnum) {
      terminalOptions.push({
        ...aa,
        stepEnum: current.stepEnum,
        stepDisplay: current.stepDisplay,
      });
    }
  }

  // Previous state goes in its own slot, only when in normal progression
  if (currentIdx !== -1 && grievance.escalations.length >= 2) {
    previousOption = toStepStatus(
      grievance.escalations[grievance.escalations.length - 2],
    );
  }

  // When 'In Abeyance', previous state goes in the forward slot
  if (
    current.statusEnum === "IN_ABEYANCE" &&
    grievance.escalations.length >= 2
  ) {
    forwardOptions.push(
      toStepStatus(grievance.escalations[grievance.escalations.length - 2]),
    );
  }

  return { forwardOptions, terminalOptions, previousOption };
}

type Selected = { stepEnum: string; statusEnum: string };

function isMatch(opt: StepStatus, selected: Selected | null): boolean {
  return (
    selected?.stepEnum === opt.stepEnum &&
    selected?.statusEnum === opt.statusEnum
  );
}

export function EscalateSection({ grievance }: { grievance: Grievance }) {
  const [, formAction] = useActionState(escalateGrievance, { error: null });
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [hearingDate, setHearingDate] = useState("");

  const { forwardOptions, terminalOptions, previousOption } =
    buildOptionGroups(grievance);

  const allOptions = [
    ...forwardOptions,
    ...terminalOptions,
    ...(previousOption ? [previousOption] : []),
  ];

  function handleSelect(opt: StepStatus) {
    setSelected({ stepEnum: opt.stepEnum, statusEnum: opt.statusEnum });
    if (opt.statusEnum !== "SCHEDULED") setHearingDate("");
  }

  const hasOptions = allOptions.length > 0;

  return (
    <section className="border-t">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-4 py-5 sm:px-6 transition-colors hover:bg-purple-100 focus"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-subtitle text-lg md:text-xl font-semibold">
            Escalate
          </h2>
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

      {expanded && hasOptions && (
        <div className="px-4 pb-6 sm:px-6 sm:pb-7">
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

              {/* Zone 1: Forward progression options — prominent */}
              {forwardOptions.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {forwardOptions.map((opt) => (
                    <ForwardCard
                      key={`${opt.stepEnum}-${opt.statusEnum}`}
                      opt={opt}
                      isSelected={isMatch(opt, selected)}
                      onSelect={() => handleSelect(opt)}
                    />
                  ))}
                </div>
              )}

              {/* Zone 2: Terminal statuses — compact secondary row */}
              {terminalOptions.length > 0 && (
                <div className={forwardOptions.length > 0 ? "mt-5" : ""}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Close/pause grievance
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {terminalOptions.map((opt) => (
                      <TerminalPill
                        key={`${opt.stepEnum}-${opt.statusEnum}`}
                        opt={opt}
                        isSelected={isMatch(opt, selected)}
                        onSelect={() => handleSelect(opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Zone 3: Go back — visually demoted, separated */}
              {previousOption && (
                <div className="mt-5 border-t border-dashed border-border pt-4">
                  <GoBackOption
                    opt={previousOption}
                    isSelected={isMatch(previousOption, selected)}
                    onSelect={() => handleSelect(previousOption)}
                  />
                </div>
              )}
            </fieldset>

            {selected?.statusEnum === "SCHEDULED" && (
              <div className="mt-2">
                <FormField
                  id="hearing-date"
                  label="Hearing Date"
                  type="date"
                  name="hearing_date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                />
              </div>
            )}

            {selected && (
              <div className="mt-5 flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={selected.statusEnum === "SCHEDULED" && !hearingDate}
                >
                  Submit Escalation
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setHearingDate("");
                  }}
                  className="rounded-md px-4 py-2.5 font-subtitle text-sm font-semibold text-muted-foreground transition-colors focus hover"
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
