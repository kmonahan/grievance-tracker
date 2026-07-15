import type { Escalation, Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";
import GrievanceDeadlineCard from "./components/GrievanceDeadlineCard";
import RecentActivityCard from "./components/RecentActivityCard";

export interface RecentActivity extends Escalation {
  grievance: string;
  grievance_id: number;
}

export default async function Home() {
  const accessToken = await getAccessToken();
  const upcomingResponse = await fetch(
    `${process.env.BACKEND_URL}/grievances/upcoming`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const upcoming = (await upcomingResponse.json()) as {
    grievances: Grievance[];
  };
  const activityResponse = await fetch(
    `${process.env.BACKEND_URL}/escalations/recent`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const recent = (await activityResponse.json()) as RecentActivity[];
  const yearTotalResponse = await fetch(
    `${process.env.BACKEND_URL}/grievances/year-total`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const yearTotal = (await yearTotalResponse.json()).year_total;

  return (
    <main className="w-full mx-auto px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-6 bg-card text-primary gap-6 rounded-xl border py-6 border-primary/20 shadow-lg">
            <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 border-b">
              <h2 className="font-bold font-title text-2xl md:text-3xl uppercase text-primary">
                Upcoming Deadlines
              </h2>
              <div className="text-muted-foreground text-base font-subtitle">
                Grievances with deadlines in the next two weeks
              </div>
            </div>
            <div className="px-6">
              {upcoming.grievances?.length ? (
                <ol className="mt-4 space-y-3">
                  {upcoming.grievances.map((grievance) => (
                    <li key={grievance.id}>
                      <GrievanceDeadlineCard {...grievance} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No upcoming deadlines</p>
              )}
            </div>
            <footer className="mt-6 flex justify-center">
              <a
                href="/grievances"
                className="font-subtitle text-base font-semibold text-primary hover:text-hover transition-colors inline-flex items-center gap-2 group"
              >
                See all grievances
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  role="presentation"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </footer>
          </section>
          <section className="flex flex-col gap-6 bg-card text-primary gap-6 rounded-xl border py-6 border-accent/20 shadow-lg">
            <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <h2 className="font-bold font-title text-2xl md:text-3xl uppercase text-primary">
                Grievances Filed in {new Date().getFullYear()}
              </h2>
            </div>
            <div className="px-6 text-center font-bold font-subtitle text-8xl text-highlight">
              {yearTotal}
            </div>
          </section>
        </div>
        <section className="flex flex-col gap-6 bg-card text-primary gap-6 rounded-xl border py-6 border-accent/20 shadow-lg">
          <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 border-b">
            <h2 className="font-bold font-title text-2xl md:text-3xl uppercase text-primary">
              Recent Activity
            </h2>
            <div className="text-muted-foreground text-base font-subtitle">
              Changes made in the last two weeks
            </div>
          </div>
          <div className="px-6">
            {recent?.length ? (
              <ol className="mt-4 space-y-3">
                {recent.map((escalation) => (
                  <li key={escalation.id}>
                    <RecentActivityCard {...escalation} />
                  </li>
                ))}
              </ol>
            ) : (
              <p>No recent activity</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
