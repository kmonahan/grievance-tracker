import Link from "next/link";
import type { RecentActivity } from "~/app/page";
import { formatDate } from "~/lib/format";

export default function RecentActivityCard({
  grievance,
  user,
  status,
  date,
}: RecentActivity) {
  const pointPersonInitials = user.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return (
    <Link href="/grievances/1">
      <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md">
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h3 className="font-subtitle font-semibold text-foreground">
              {grievance}
            </h3>
            <span className="text-sm text-muted-foreground sm:whitespace-nowrap">
              {formatDate(date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-sm text-accent-foreground">
              {pointPersonInitials}
            </span>
            <span className="text-muted-foreground">{user.name}</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <span className="inline-flex items-center rounded-md border border-transparent bg-chart-4 px-2 py-0.5 text-sm font-medium text-white">
              Moved to
            </span>
            <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-sm font-medium text-foreground">
              {status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
