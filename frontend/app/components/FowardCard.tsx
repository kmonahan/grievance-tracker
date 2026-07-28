import { StatusTag } from "~/app/components/StatusTag";
import type { OptionStyle, StepStatus } from "~/app/grievances/types";
import {
  isValidStatus,
  STATUS_STYLES,
  StatusDisplayToEnum,
} from "~/app/status";

export const DEFAULT_OPTION_STYLE: OptionStyle = {
  ...STATUS_STYLES[StatusDisplayToEnum.WAITING_TO_SCHEDULE],
  icon: null,
};

export interface ForwardCardProps {
  opt: StepStatus;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ForwardCard({
  opt,
  isSelected,
  onSelect,
}: ForwardCardProps) {
  const style = isValidStatus(opt.statusDisplay)
    ? STATUS_STYLES[opt.statusDisplay]
    : DEFAULT_OPTION_STYLE;
  return (
    <label
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all focus-inside ${
        isSelected
          ? `${style.selectedClasses} ${style.borderClass}`
          : `border-border bg-card ${style.hoverClasses} hover:shadow-sm`
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-6 ${style.iconClass}`}
            aria-hidden="true"
          >
            {style.icon}
          </svg>
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <StatusTag status={opt.statusDisplay} size="large" />
        <span
          className={`text-sm ${isSelected ? "text-neutral-950" : "text-muted-foreground"}`}
        >
          {opt.stepDisplay}
        </span>
      </div>
      {isSelected && (
        <span className="absolute right-3 top-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-4 ${style.iconClass}`}
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
