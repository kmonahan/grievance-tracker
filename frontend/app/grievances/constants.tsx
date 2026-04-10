import type { OptionStyle, StepStatus } from "~/app/grievances/types";

export const STEP_DISPLAY_TO_ENUM: Record<string, string> = {
  "Step #1": "ONE",
  "Step #2": "TWO",
  "Step #3": "THREE",
  "Step #4": "FOUR",
  "Step #5": "FIVE",
};

export const STATUS_DISPLAY_TO_ENUM: Record<string, string> = {
  "Waiting to Schedule": "WAITING_TO_SCHEDULE",
  Scheduled: "SCHEDULED",
  "Waiting to File": "WAITING_TO_FILE",
  "Waiting on Decision": "WAITING_ON_DECISION",
  Resolved: "RESOLVED",
  Denied: "DENIED",
  Withdrawn: "WITHDRAWN",
  "In Abeyance": "IN_ABEYANCE",
};

// Linear progression of non-terminal escalation states
export const STATE_SEQUENCE: StepStatus[] = [
  {
    stepEnum: "ONE",
    stepDisplay: "Step #1",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "ONE",
    stepDisplay: "Step #1",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "ONE",
    stepDisplay: "Step #1",
    statusEnum: "WAITING_TO_FILE",
    statusDisplay: "Waiting to File",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "WAITING_ON_DECISION",
    statusDisplay: "Waiting on Decision",
  },
  {
    stepEnum: "THREE",
    stepDisplay: "Step #3",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "THREE",
    stepDisplay: "Step #3",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "THREE",
    stepDisplay: "Step #3",
    statusEnum: "WAITING_ON_DECISION",
    statusDisplay: "Waiting on Decision",
  },
  {
    stepEnum: "FOUR",
    stepDisplay: "Step #4",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "FOUR",
    stepDisplay: "Step #4",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "FOUR",
    stepDisplay: "Step #4",
    statusEnum: "WAITING_ON_DECISION",
    statusDisplay: "Waiting on Decision",
  },
  {
    stepEnum: "FIVE",
    stepDisplay: "Step #5",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "FIVE",
    stepDisplay: "Step #5",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "FIVE",
    stepDisplay: "Step #5",
    statusEnum: "WAITING_ON_DECISION",
    statusDisplay: "Waiting on Decision",
  },
];

export const ALWAYS_AVAILABLE = [
  { statusEnum: "RESOLVED", statusDisplay: "Resolved" },
  { statusEnum: "DENIED", statusDisplay: "Denied" },
  { statusEnum: "WITHDRAWN", statusDisplay: "Withdrawn" },
  { statusEnum: "IN_ABEYANCE", statusDisplay: "In Abeyance" },
];

export const STATUS_STYLES: Record<string, OptionStyle> = {
  WAITING_TO_SCHEDULE: {
    selectedClasses: "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-blue-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-blue-500/10 text-blue-800 border border-blue-300",
  },
  SCHEDULED: {
    selectedClasses: "border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-teal-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-teal-500 text-teal-0",
  },
  WAITING_TO_FILE: {
    selectedClasses:
      "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-amber-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 10Zm.75 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 1 0 0-1.5h-6.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-amber-500/10 text-amber-800 border border-amber-300",
  },
  WAITING_ON_DECISION: {
    selectedClasses:
      "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-violet-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-violet-500/10 text-violet-800 border border-violet-300",
  },
  RESOLVED: {
    selectedClasses: "border-teal-700 bg-teal-700/10 ring-2 ring-teal-700/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-teal-700"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-teal-600 text-teal-0",
  },
  DENIED: {
    selectedClasses:
      "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-orange-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-orange-500/10 text-orange-800 border border-orange-300",
  },
  WITHDRAWN: {
    selectedClasses: "border-red-500 bg-red-50 ring-2 ring-red-400/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-red-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-red-500 text-neutral-0",
  },
  IN_ABEYANCE: {
    selectedClasses: "border-neutral-400 bg-neutral-50 ring-2 ring-neutral-300",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-neutral-500"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    badgeClasses: "bg-neutral-50 text-neutral-800 border border-neutral-300",
  },
};
