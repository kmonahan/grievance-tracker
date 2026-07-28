import { DEFAULT_OPTION_STYLE } from "~/app/components/FowardCard";
import type { StepStatus } from "~/app/grievances/types";
import { isValidStatus, STATUS_STYLES } from "~/app/status";

export interface TerminalPillProps {
  opt: StepStatus;
  isSelected: boolean;
  onSelect: () => void;
}

export default function TerminalPill({
  opt,
  isSelected,
  onSelect,
}: TerminalPillProps) {
  const style = isValidStatus(opt.statusDisplay)
    ? STATUS_STYLES[opt.statusDisplay]
    : DEFAULT_OPTION_STYLE;
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-inside ${
        isSelected
          ? `${style.selectedClasses} font-semibold`
          : `border-border text-muted-foreground ${style.hoverClasses}`
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
          className={`size-3.5 shrink-0 ${style.iconClass}`}
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
