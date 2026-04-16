import Link from "next/link";
import { isClosed } from "~/app/grievances/constants";
import { GrievanceFilterView } from "~/app/grievances/GrievanceFilterView";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";

export default async function GrievancesPage() {
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/grievances/all`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { grievances } = (await response.json()) as { grievances: Grievance[] };

  const openCount = grievances.filter((g) => !isClosed(g)).length;

  return (
    <main className="w-full mx-auto px-5 md:px-6 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-title text-4xl font-bold text-primary">
              All Grievances
            </h1>
            <p className="mt-1 font-subtitle text-base text-muted-foreground">
              {openCount} open grievance{openCount !== 1 ? "s" : ""}
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

        {grievances.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <p className="font-subtitle text-lg font-semibold text-muted-foreground">
              No open grievances
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              New grievances will appear here once filed.
            </p>
          </div>
        ) : (
          <GrievanceFilterView grievances={grievances} />
        )}
      </div>
    </main>
  );
}
