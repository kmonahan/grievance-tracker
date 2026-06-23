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
  if (
    current.statusEnum === "WAITING_TO_SCHEDULE" &&
    currentIdx !== -1 &&
    currentIdx + 2 < STATE_SEQUENCE.length
  ) {
    forwardOptions.push(STATE_SEQUENCE[currentIdx + 2]);
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

  return { forwardOptions, terminalOptions, previousOption };
}

type Selected = { stepEnum: string; statusEnum: string };

function isMatch(opt: StepStatus, selected: Selected | null): boolean {
  return (
    selected?.stepEnum === opt.stepEnum &&
    selected?.statusEnum === opt.statusEnum
  );
}

interface ForwardCardProps {
  opt: StepStatus;
  isSelected: boolean;
  onSelect: () => void;
}

function ForwardCard({ opt, isSelected, onSelect }: ForwardCardProps) {
  const style = STATUS_STYLES[opt.statusEnum] ?? DEFAULT_OPTION_STYLE;
  return (
    <label
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
        isSelected
          ? style.selectedClasses
          : "border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm"
      }`}
    >
      <input
        type="radio"
        name="escalation-status"
        value={opt.statusEnum}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      {style.icon && (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl"
          aria-hidden="true"
        >
          {style.icon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={`inline-flex items-center self-start rounded-md px-2 py-0.5 text-base font-medium ${style.badgeClasses}`}
        >
          {opt.statusDisplay}
        </span>
        <span className="text-sm text-muted-foreground">{opt.stepDisplay}</span>
      </div>
      {/* Forward arrow — signals progression */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`size-5 shrink-0 transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground/70"}`}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
          clipRule="evenodd"
        />
      </svg>
      {isSelected && (
        <span className="absolute right-3 top-3">
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
        </span>
      )}
    </label>
  );
}

interface TerminalPillProps {
  opt: StepStatus;
  isSelected: boolean;
  onSelect: () => void;
}

function TerminalPill({ opt, isSelected, onSelect }: TerminalPillProps) {
  const style = STATUS_STYLES[opt.statusEnum] ?? DEFAULT_OPTION_STYLE;
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
        isSelected
          ? `${style.selectedClasses} font-semibold`
          : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
      }`}
    >
      <input
        type="radio"
        name="escalation-status"
        value={opt.statusEnum}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      {isSelected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-3.5 shrink-0 text-teal-600"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {opt.statusDisplay}
    </label>
  );
}

interface GoBackOptionProps {
  opt: StepStatus;
  isSelected: boolean;
  onSelect: () => void;
}

function GoBackOption({ opt, isSelected, onSelect }: GoBackOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all ${
        isSelected
          ? "bg-muted/60 text-foreground font-medium ring-1 ring-border"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      <input
        type="radio"
        name="escalation-status"
        value={opt.statusEnum}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      {/* Undo arrow — signals going back, not forward */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4 shrink-0 opacity-60"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 0 1 0 10.75H10.75a.75.75 0 0 1 0-1.5h2.875a3.875 3.875 0 0 0 0-7.75H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.06.025Z"
          clipRule="evenodd"
        />
      </svg>
      <span>
        Go back to <span className="font-medium">{opt.statusDisplay}</span>
        <span className="ml-1 text-xs opacity-70">({opt.stepDisplay})</span>
      </span>
    </label>
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
