import Link from "next/link";

export default function RecentActivityCard() {
  return (
    <Link href="/grievances/1">
      <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-subtitle font-semibold text-foreground flex-1">
              Denial of Bereavement Leave
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              1d ago
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs text-accent-foreground">
              WR
            </span>
            <span className="text-muted-foreground">Walter Reuther</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              In Progress
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-muted-foreground"
              aria-hidden="true"
            >
              <path d="M16 7h6v6" />
              <path d="m22 7-8.5 8.5-5-5L2 17" />
            </svg>
            <span className="inline-flex items-center rounded-md border border-transparent bg-chart-4 px-2 py-0.5 text-xs font-medium text-white">
              Review
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Feb 15, 2026</div>
        </div>
      </div>
    </Link>
  );
}
