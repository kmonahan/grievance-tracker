import {getAccessToken} from "~/app/lib/auth";
import AddHolidayButton from "./AddHolidayButton";
import type {Holiday} from "./HolidayRow";
import HolidayRow from "./HolidayRow";

export default async function HolidaysPage(): Promise<React.ReactElement> {
  const token = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/holidays`, {
    headers: {Authorization: `Bearer ${token}`},
  });

  const holidays: Holiday[] = await response.json();

  return (
    <main className="px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-title text-3xl text-primary">Holidays</h1>

        {holidays.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card py-12 text-center">
            <p className="font-subtitle text-muted-foreground">
              No holidays found.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {holidays.map((holiday) => (
              <HolidayRow key={holiday.id} holiday={holiday}/>
            ))}
          </ul>
        )}
        <AddHolidayButton/>
      </div>
    </main>
  );
}
