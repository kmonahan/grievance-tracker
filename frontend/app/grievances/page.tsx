import Link from "next/link";
import { GrievanceCard } from "~/app/components/GrievanceCard";
import { ShowClosedToggle } from "~/app/grievances/ShowClosedToggle";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";

const CLOSED_STATUSES = ["Resolved", "Denied", "Withdrawn"];

function isClosed(grievance: Grievance): boolean {
  const latest = grievance.escalations.at(-1);
  return !!latest && CLOSED_STATUSES.includes(latest.status);
}

interface PageProps {
  searchParams: Promise<{ showClosed?: string }>;
}

export default async function GrievancesPage({ searchParams }: PageProps) {
  const [accessToken, { showClosed: showClosedParam }] = await Promise.all([
    getAccessToken(),
    searchParams,
  ]);

  const showClosed = showClosedParam === "true";

  const response = await fetch(`${process.env.BACKEND_URL}/grievances/all`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { grievances } = (await response.json()) as { grievances: Grievance[] };

  const openGrievances = grievances.filter((g) => !isClosed(g));
  const closedGrievances = grievances.filter(isClosed);

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
          <div className="flex items-center gap-3">
            <ShowClosedToggle
              showClosed={showClosed}
              closedCount={closedGrievances.length}
            />
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
        </div>

        {/* Open grievances */}
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

        {/* Closed grievances */}
        {showClosed && (
          <section className="mt-10">
            <h2 className="mb-4 font-subtitle text-lg font-semibold text-muted-foreground">
              Closed ({closedGrievances.length})
            </h2>
            {closedGrievances.length > 0 ? (
              <ol className="space-y-3">
                {closedGrievances.map((grievance) => (
                  <li key={grievance.id}>
                    <GrievanceRow grievance={grievance} muted />
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-10 text-center">
                <p className="text-base text-muted-foreground">
                  No closed grievances.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function GrievanceRow({
  grievance,
  muted = false,
}: {
  grievance: Grievance;
  muted?: boolean;
}) {
  return <GrievanceCard grievance={grievance} muted={muted} />;
}
