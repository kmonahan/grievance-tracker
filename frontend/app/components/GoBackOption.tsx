import type { StepStatus } from "~/app/grievances/types";

export interface GoBackOptionProps {
  opt: StepStatus;
  isSelected: boolean;
  onSelect: () => void;
}

export default function GoBackOption({
  opt,
  isSelected,
  onSelect,
}: GoBackOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all focus-inside ${
        isSelected
          ? "bg-purple-100 text-primary font-medium ring-1 ring-primary"
          : "text-muted-foreground hover:text-hover"
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
