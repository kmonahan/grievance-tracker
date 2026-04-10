const STATUS_COLORS: Record<string, string> = {
  "Waiting to Schedule": "bg-accent text-accent-foreground",
  Scheduled: "bg-teal-500 text-teal-0",
  "Waiting on Decision": "bg-red-500 text-neutral-0",
  "Waiting to File": "bg-plum-500 text-neutral-0",
  "In Abeyance": "bg-neutral-50 text-neutral-800",
};

export function getStatusClasses(status: string): string {
  return STATUS_COLORS[status] ?? "bg-muted text-muted-foreground";
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
