import { notFound } from "next/navigation";
import { EscalationTimeline } from "~/app/components/EscalationTimeline";
import PointPerson from "~/app/components/PointPerson";
import { StatusTag } from "~/app/components/StatusTag";
import FancyLink from "~/app/components/ui/FancyLink";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";
import { EditDueDateSection } from "../../components/EditDueDateSection";
import { EscalateSection } from "../../components/EscalateSection";

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
      <article className="mx-auto w-full max-w-4xl bg-card text-primary rounded-xl border py-6 border-primary/20 shadow-lg">
        <header className="border-b px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-title text-2xl uppercase font-bold md:text-3xl lg:text-4xl">
              {grievance.name}
            </h1>
            {latestEscalation && <StatusTag status={latestEscalation.status} />}
          </div>
          <div className="flex items-center justify-between gap-3 mt-1">
            <div className="text-base font-subtitle text-muted-foreground">
              {grievance.category}
            </div>
            <FancyLink text="Edit" href={`/grievances/${id}/edit`} />
          </div>
        </header>

        <section className="border-b px-4 py-5 sm:px-6 sm:py-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="label">Description</dt>
              <dd className="mt-1">{grievance.description}</dd>
            </div>
            <div className="space-y-4">
              {latestEscalation?.step && (
                <div>
                  <dt className="label">Current Step</dt>
                  <dd className="mt-1">{latestEscalation.step}</dd>
                </div>
              )}
              <div>
                <dt className="label">Point Person</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <PointPerson pointPersonName={grievance.point_person} />
                </dd>
              </div>
              {grievance.secondary && (
                <div>
                  <dt className="label">Secondary Person</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <PointPerson pointPersonName={grievance.secondary} />
                  </dd>
                </div>
              )}
              {latestEscalation && (
                <EditDueDateSection
                  key={latestEscalation.id}
                  escalationId={latestEscalation.id}
                  initialDateDue={latestEscalation.date_due}
                  initialDeadlineMissed={latestEscalation.deadline_missed}
                />
              )}
            </div>
          </dl>
        </section>
        {grievance.escalations.length > 0 && (
          <section className="border-b px-4 py-5 sm:px-6 sm:py-6">
            <h2 className="font-subtitle mb-4 text-lg md:text-xl font-semibold">
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
