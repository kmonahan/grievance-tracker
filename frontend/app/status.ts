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

export const STATUS_COLORS: Record<StatusDisplayToEnum, string> = {
  [StatusDisplayToEnum.WAITING_TO_SCHEDULE]: "bg-yellow-400 text-neutral-950",
  [StatusDisplayToEnum.SCHEDULED]: "bg-teal-500 text-neutral-0",
  [StatusDisplayToEnum.WAITING_ON_DECISION]: "bg-purple-700 text-neutral-0",
  [StatusDisplayToEnum.WAITING_TO_FILE]: "bg-red-500 text-neutral-0",
  [StatusDisplayToEnum.RESOLVED]: "bg-neutral-900 text-neutral-0",
  [StatusDisplayToEnum.DENIED]: "bg-orange-500 text-neutral-0",
  [StatusDisplayToEnum.WITHDRAWN]: "bg-neutral-50 text-neutral-800",
  [StatusDisplayToEnum.IN_ABEYANCE]: "bg-neutral-50 text-neutral-800",
};
