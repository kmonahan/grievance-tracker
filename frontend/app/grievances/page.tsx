import Link from "next/link";
import { StatusTag } from "~/app/components/StatusTag";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";
import { formatDate, getInitials } from "~/lib/format";

const CATEGORY_COLORS: Record<string, string> = {
  "Health & Safety": "bg-red-500/10 text-red-700 border-red-200",
  Leave: "bg-teal-500/10 text-teal-700 border-teal-200",
  Scheduling: "bg-amber-500/10 text-amber-800 border-amber-200",
  "Promotion & Posting": "bg-plum-500/10 text-plum-100 border-plum-200",
  Discipline: "bg-orange-500/10 text-orange-800 border-orange-200",
  Workload: "bg-secondary/10 text-secondary border-secondary/20",
  Accommodation: "bg-teal-200/30 text-teal-700 border-teal-300",
};

function getCategoryClasses(category: string): string {
  return (
    CATEGORY_COLORS[category] ??
    "bg-neutral-100 text-neutral-700 border-neutral-200"
  );
}

export default async function GrievancesPage() {
  const accessToken = await getAccessToken();
  const response = await fetch(`${process.env.BACKEND_URL}/grievances/all`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { grievances } = (await response.json()) as { grievances: Grievance[] };

  const openGrievances = grievances.filter((g) => {
    const latest = g.escalations.at(-1);
    return (
      !latest || !["Resolved", "Denied", "Withdrawn"].includes(latest.status)
    );
  });

  return (
    <main className="w-full mx-auto px-5 md:px-6 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Page header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-title text-4xl font-bold text-primary">
              All Grievances
            </h1>
            <p className="mt-1 font-subtitle text-base text-muted-foreground">
              {openGrievances.length} open grievance
              {openGrievances.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/grievances/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-subtitle text-base font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Add Grievance
          </Link>
        </div>

        {/* Grievance list */}
        {openGrievances.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <p className="font-subtitle text-lg font-semibold text-muted-foreground">
              No open grievances
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              New grievances will appear here once filed.
            </p>
          </div>
        ) : (
          <ol className="space-y-3">
            {openGrievances.map((grievance) => (
              <li key={grievance.id}>
                <GrievanceRow grievance={grievance} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}

function GrievanceRow({ grievance }: { grievance: Grievance }) {
  const latestEscalation = grievance.escalations.at(-1) ?? null;
  const initials = getInitials(grievance.point_person);

  return (
    <Link href={`/grievances/${grievance.id}`} className="group block">
      <article className="rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex">
          {/* Status stripe */}
          <div
            className={`w-1 shrink-0 rounded-l-xl ${latestEscalation ? (STATUS_STRIPE_COLORS[latestEscalation.status] ?? "bg-border") : "bg-border"}`}
            aria-hidden="true"
          />

          <div className="flex flex-1 flex-col gap-3 px-5 py-4">
            {/* Top row: name + status */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-subtitle text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {grievance.name}
              </h2>
              {latestEscalation && (
                <StatusTag status={latestEscalation.status} />
              )}
            </div>

            {/* Middle row: category + step */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-sm font-medium ${getCategoryClasses(grievance.category)}`}
              >
                {grievance.category}
              </span>
              {latestEscalation?.step && (
                <span className="text-sm text-muted-foreground">
                  {latestEscalation.step}
                </span>
              )}
            </div>

            {/* Bottom row: point person + due date */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                  {initials}
                </span>
                <span className="text-sm text-muted-foreground">
                  {grievance.point_person}
                </span>
              </div>

              {latestEscalation &&
                (latestEscalation.date_due ? (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-accent font-subtitle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-3.5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3h.25A2.75 2.75 0 0 1 15 5.75v7.5A2.75 2.75 0 0 1 12.25 16H3.75A2.75 2.75 0 0 1 1 13.25v-7.5A2.75 2.75 0 0 1 3.75 3H4V1.75ZM3.75 6a1.25 1.25 0 0 0-1.25 1.25v6c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-6c0-.69-.56-1.25-1.25-1.25H3.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Due {formatDate(latestEscalation.date_due)}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground/50">
                    No deadline
                  </span>
                ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

const STATUS_STRIPE_COLORS: Record<string, string> = {
  "Waiting to Schedule": "bg-accent",
  Scheduled: "bg-teal-500",
  "Waiting on Decision": "bg-red-500",
  "Waiting to File": "bg-plum-500",
  "In Abeyance": "bg-neutral-300",
};
