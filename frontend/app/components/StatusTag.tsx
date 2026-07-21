import { isValidStatus, STATUS_COLORS } from "~/app/status";

export function getStatusClasses(status: string): string {
  return isValidStatus(status)
    ? STATUS_COLORS[status]
    : "bg-neutral-50 text-neutral-800";
}

interface StatusTagProps {
  status: string;
}

export function StatusTag({ status }: StatusTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-sm font-medium ${getStatusClasses(status)}`}
    >
      {status}
    </span>
  );
}
