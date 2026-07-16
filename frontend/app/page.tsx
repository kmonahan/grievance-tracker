import QuickViewCard from "~/app/components/ui/QuickViewCard";
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
          <QuickViewCard
            title="Upcoming Deadlines"
            description="Grievances with deadlines in the next two weeks"
            link={{ text: "See all grievances", href: "/grievances" }}
          >
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
          </QuickViewCard>
          <QuickViewCard
            title={`Grievances Filed in ${new Date().getFullYear()}`}
          >
            <div className="px-6 text-center font-bold font-subtitle text-8xl text-highlight">
              {yearTotal}
            </div>
          </QuickViewCard>
        </div>
        <QuickViewCard
          title="Recent Activity"
          description="Changes made in the last two weeks"
        >
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
        </QuickViewCard>
      </div>
    </main>
  );
}
