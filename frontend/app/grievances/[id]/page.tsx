import type { Escalation } from "~/app/grievances/types";
import { EXAMPLE_GRIEVANCES } from "./constants";

const STATUS_COLORS: Record<string, string> = {
  "Waiting to Schedule": "bg-accent text-accent-foreground",
  Scheduled: "bg-teal-500 text-teal-0",
  "Waiting on Decision": "bg-red-500 text-neutral-0",
  "Waiting to File": "bg-plum-500 text-neutral-0",
  "In Abeyance": "bg-neutral-50 text-neutral-800",
};

function getStatusClasses(status: string): string {
  return STATUS_COLORS[status] ?? "bg-muted text-muted-foreground";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EscalationTimeline({ escalations }: { escalations: Escalation[] }) {
  const reversed = [...escalations].reverse();

  return (
    <ol className="relative ml-4 border-l-2 border-border">
      {reversed.map((esc) => (
        <li key={esc.id} className="relative mb-8 ml-6 last:mb-0">
          <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-card" />
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <time className="text-sm text-teal-600">
                {formatDate(esc.date)}
              </time>
              <span className="font-subtitle text-sm font-semibold">
                {esc.step}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getStatusClasses(esc.status)}`}
              >
                {esc.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-teal-700">
              {esc.hearing_date && (
                <span>Hearing: {formatDate(esc.hearing_date)}</span>
              )}
              {esc.date_due && <span>Due: {formatDate(esc.date_due)}</span>}
              <span className="flex items-center gap-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-[10px] text-secondary-foreground">
                  {getInitials(esc.user.name)}
                </span>
                {esc.user.name}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function GrievanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const grievance = EXAMPLE_GRIEVANCES.find((g) => g.id === Number(id));

  if (!grievance) {
    return (
      <main className="w-full px-5 md:px-6 py-8">
        <div className="mx-auto w-full max-w-5xl bg-card text-card-foreground rounded-xl border p-8 shadow-lg">
          <h1 className="font-title text-2xl font-bold">Grievance not found</h1>
          <p className="mt-2 text-muted-foreground">
            No grievance exists with ID {id}.
          </p>
        </div>
      </main>
    );
  }

  const latestEscalation =
    grievance.escalations.length > 0
      ? grievance.escalations[grievance.escalations.length - 1]
      : null;

  return (
    <main className="w-full px-5 md:px-6 py-8">
      <article className="mx-auto w-full max-w-4xl bg-card text-card-foreground rounded-xl border shadow-lg">
        <header className="border-b px-6 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-title text-2xl font-bold">{grievance.name}</h1>
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {grievance.category}
            </span>
            {latestEscalation && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getStatusClasses(latestEscalation.status)}`}
              >
                {latestEscalation.status}
              </span>
            )}
          </div>
        </header>

        <section className="border-b px-6 py-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-subtitle text-sm font-semibold text-teal-600">
                Description
              </dt>
              <dd className="mt-1">{grievance.description}</dd>
            </div>
            <div className="space-y-4">
              <div>
                <dt className="font-subtitle text-sm font-semibold text-teal-600">
                  Point Person
                </dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs text-secondary-foreground">
                    {getInitials(grievance.point_person)}
                  </span>
                  {grievance.point_person}
                </dd>
              </div>
              {latestEscalation?.date_due && (
                <div>
                  <dt className="font-subtitle text-sm font-semibold text-teal-600">
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
            <h2 className="font-subtitle mb-4 text-lg font-semibold">
              Escalation History
            </h2>
            <EscalationTimeline escalations={grievance.escalations} />
          </section>
        )}
      </article>
    </main>
  );
}
