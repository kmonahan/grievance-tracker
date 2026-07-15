const STATUS_COLORS: Record<string, string> = {
  "Waiting to Schedule": "bg-yellow-400 text-neutral-900",
  Scheduled: "bg-purple-500 text-neutral-0",
  "Waiting on Decision": "bg-red-500 text-neutral-0",
  "Prepare for Next Step": "bg-teal-500 text-teal-0",
  "In Abeyance": "bg-neutral-50 text-neutral-800",
};

export function getStatusClasses(status: string): string {
  return STATUS_COLORS[status] ?? "bg-neutral-50 text-neutral-800";
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
