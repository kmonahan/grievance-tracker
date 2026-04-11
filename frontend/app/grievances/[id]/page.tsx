import Link from "next/link";
import { notFound } from "next/navigation";
import { EscalationTimeline } from "~/app/components/EscalationTimeline";
import { StatusTag } from "~/app/components/StatusTag";
import { EditDueDateSection } from "~/app/grievances/[id]/EditDueDateSection";
import { EscalateSection } from "~/app/grievances/[id]/EscalateSection";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";
import { getInitials } from "~/lib/format";

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
    notFound();
  }

  const grievance: Grievance = await response.json();

  const latestEscalation =
    grievance.escalations.length > 0
      ? grievance.escalations[grievance.escalations.length - 1]
      : null;

  return (
    <main className="w-full px-4 md:px-6 py-6 md:py-8">
      <article className="mx-auto w-full max-w-4xl bg-card text-card-foreground rounded-xl border shadow-lg">
        <header className="border-b px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-title text-2xl font-bold md:text-3xl">
              {grievance.name}
            </h1>
            {latestEscalation && <StatusTag status={latestEscalation.status} />}
          </div>
          <div className="flex items-center justify-between gap-3 mt-1">
            <div className="text-base font-subtitle text-muted-foreground">
              {grievance.category}
            </div>
            <Link
              href={`/grievances/${id}/edit`}
              className="text-base font-subtitle font-medium text-secondary hover:underline"
            >
              Edit
            </Link>
          </div>
        </header>

        <section className="border-b px-4 py-5 sm:px-6 sm:py-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-subtitle text-base font-semibold text-teal-600">
                Description
              </dt>
              <dd className="mt-1">{grievance.description}</dd>
            </div>
            <div className="space-y-4">
              {latestEscalation?.step && (
                <div>
                  <dt className="font-subtitle text-base font-semibold text-teal-600">
                    Current Step
                  </dt>
                  <dd className="mt-1">{latestEscalation.step}</dd>
                </div>
              )}
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
                <EditDueDateSection
                  escalationId={latestEscalation.id}
                  initialDateDue={latestEscalation.date_due}
                />
              )}
            </div>
          </dl>
        </section>
        {grievance.escalations.length > 0 && (
          <section className="border-b px-4 py-5 sm:px-6 sm:py-6">
            <h2 className="font-subtitle mb-4 text-xl font-semibold">
              History
            </h2>
            <EscalationTimeline escalations={grievance.escalations} />
          </section>
        )}
        <EscalateSection grievance={grievance} />
      </article>
    </main>
  );
}
