import { EscalationTimeline } from "~/app/components/EscalationTimeline";
import { StatusTag } from "~/app/components/StatusTag";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";
import { formatDate, getInitials } from "~/lib/format";

export default async function GrievanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/grievances/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return (
      <main className="w-full px-5 md:px-6 py-8">
        <div className="mx-auto w-full max-w-5xl bg-card text-card-foreground rounded-xl border p-8 shadow-lg">
          <h1 className="font-title text-3xl font-bold">Grievance not found</h1>
          <p className="mt-2 text-muted-foreground">
            No grievance exists with ID {id}.
          </p>
        </div>
      </main>
    );
  }

  const grievance: Grievance = await response.json();

  const latestEscalation =
    grievance.escalations.length > 0
      ? grievance.escalations[grievance.escalations.length - 1]
      : null;

  return (
    <main className="w-full px-5 md:px-6 py-8">
      <article className="mx-auto w-full max-w-4xl bg-card text-card-foreground rounded-xl border shadow-lg">
        <header className="border-b px-6 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-title text-3xl font-bold">{grievance.name}</h1>
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
              {grievance.category}
            </span>
            {latestEscalation && <StatusTag status={latestEscalation.status} />}
          </div>
        </header>

        <section className="border-b px-6 py-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-subtitle text-base font-semibold text-teal-600">
                Description
              </dt>
              <dd className="mt-1">{grievance.description}</dd>
            </div>
            <div className="space-y-4">
              <div>
                <dt className="font-subtitle text-base font-semibold text-teal-600">
                  Point Person
                </dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm text-secondary-foreground">
                    {getInitials(grievance.point_person)}
                  </span>
                  {grievance.point_person}
                </dd>
              </div>
              {latestEscalation?.date_due && (
                <div>
                  <dt className="font-subtitle text-base font-semibold text-teal-600">
                    Upcoming Due Date
                  </dt>
                  <dd className="mt-1 font-semibold text-accent">
                    {formatDate(latestEscalation.date_due)}
                  </dd>
                </div>
              )}
            </div>
          </dl>
        </section>

        {grievance.escalations.length > 0 && (
          <section className="px-6 py-6">
            <h2 className="font-subtitle mb-4 text-xl font-semibold">
              Escalation History
            </h2>
            <EscalationTimeline escalations={grievance.escalations} />
          </section>
        )}
      </article>
    </main>
  );
}
