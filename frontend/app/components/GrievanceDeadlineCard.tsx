import Link from "next/link";

export default function GrievanceDeadlineCard() {
  return (
    <Link href="/grievances/1">
      <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-subtitle font-semibold text-foreground">
                Denial of Bereavement Leave
              </h3>
              <span className="inline-flex items-center rounded-md border border-transparent bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                In Progress
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs text-secondary-foreground">
                WR
              </span>
              <span className="text-muted-foreground">Walter Reuther</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-subtitle text-sm font-semibold text-accent">
              12 days
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Feb 28, 2026
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
