import type { OptionStyle } from "~/app/grievances/types";

export const CLOSED_STATUSES = new Set(["Resolved", "Denied", "Withdrawn"]);

export enum StatusDisplayToEnum {
  WAITING_TO_SCHEDULE = "Waiting to Schedule",
  SCHEDULED = "Scheduled",
  WAITING_TO_FILE = "Prepare for Next Step",
  WAITING_ON_DECISION = "Waiting on Decision",
  RESOLVED = "Resolved",
  DENIED = "Denied",
  WITHDRAWN = "Withdrawn",
  IN_ABEYANCE = "In Abeyance",
}

export const isValidStatus = (type: string): type is StatusDisplayToEnum => {
  return Object.values(StatusDisplayToEnum).includes(
    type as StatusDisplayToEnum,
  );
};

export const STATUS_STYLES: Record<StatusDisplayToEnum, OptionStyle> = {
  [StatusDisplayToEnum.WAITING_TO_SCHEDULE]: {
    backgroundClass: "bg-yellow-200",
    textClass: "text-neutral-950",
    borderClass: "border-yellow-500",
    hoverClasses: "hover:border-yellow-500 hover:bg-yellow-200/10",
    selectedClasses: "bg-yellow-200/10 ring-2 ring-yellow-200/30",
    iconClass: "text-yellow-500",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-yellow-500/10 text-yellow-800 border border-yellow-300",
  },
  [StatusDisplayToEnum.SCHEDULED]: {
    backgroundClass: "bg-teal-500",
    borderClass: "border-teal-600",
    hoverClasses: "hover:border-teal-600 hover:bg-teal-500/10",
    textClass: "text-neutral-0",
    selectedClasses: "bg-teal-500/10 ring-2 ring-teal-500/30",
    iconClass: "text-teal-600",
    icon: (
      <path
        fillRule="evenodd"
        d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-teal-500 text-teal-0",
  },
  [StatusDisplayToEnum.WAITING_TO_FILE]: {
    backgroundClass: "bg-red-700",
    textClass: "text-neutral-0",
    borderClass: "border-red-800",
    hoverClasses: "hover:border-red-800 hover:bg-red-700/10",
    selectedClasses: "bg-red-700/10 ring-2 ring-red-700/30",
    iconClass: "text-red-800",
    icon: (
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 10Zm.75 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 1 0 0-1.5h-6.5Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-red-700/10 text-red-900 border border-red-700",
  },
  [StatusDisplayToEnum.WAITING_ON_DECISION]: {
    backgroundClass: "bg-purple-600",
    textClass: "text-neutral-0",
    borderClass: "border-purple-700",
    hoverClasses: "hover:border-purple-700 hover:bg-purple-600/10",
    selectedClasses: "bg-purple-600/10 ring-2 ring-purple-600/30",
    iconClass: "text-purple-700",
    icon: (
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-purple-500/10 text-purple-800 border border-purple-300",
  },
  [StatusDisplayToEnum.RESOLVED]: {
    backgroundClass: "bg-neutral-900",
    textClass: "text-neutral-0",
    borderClass: "border-neutral-950",
    hoverClasses: "hover:border-neutral-900 hover:bg-neutral-900/10",
    selectedClasses: "bg-neutral-900/10 ring-2 ring-neutral-900/30",
    iconClass: "text-neutral-950",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-neutral-900 text-neutral-0",
  },
  [StatusDisplayToEnum.DENIED]: {
    backgroundClass: "bg-orange-500",
    textClass: "text-neutral-0",
    borderClass: "border-orange-600",
    hoverClasses: "hover:border-orange-600 hover:bg-orange-500/10",
    iconClass: "text-orange-600",
    selectedClasses: "bg-orange-500/10 ring-2 ring-orange-500/30",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-orange-500/10 text-orange-800 border border-orange-300",
  },
  [StatusDisplayToEnum.WITHDRAWN]: {
    backgroundClass: "bg-neutral-50",
    borderClass: "border-neutral-800",
    hoverClasses: "hover:border-neutral-800 hover:bg-neutral-50",
    textClass: "text-neutral-800",
    selectedClasses: "bg-neutral-50 ring-2 ring-neutral-400/30",
    iconClass: "text-neutral-800",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-neutral-50 text-neutral-800",
  },
  [StatusDisplayToEnum.IN_ABEYANCE]: {
    backgroundClass: "bg-neutral-50",
    borderClass: "border-neutral-800",
    hoverClasses: "hover:border-neutral-800 hover:bg-neutral-50",
    textClass: "text-neutral-800",
    selectedClasses: "bg-neutral-50 ring-2 ring-neutral-400/30",
    iconClass: "text-neutral-900",
    icon: (
      <path
        fillRule="evenodd"
        d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Z"
        clipRule="evenodd"
      />
    ),
    badgeClasses: "bg-neutral-50 text-neutral-800",
  },
};

export const STATUS_COLORS = Object.fromEntries(
  Object.entries(STATUS_STYLES).map(([key, value]) => [
    key,
    `${value.backgroundClass} ${value.textClass}`,
  ]),
);
