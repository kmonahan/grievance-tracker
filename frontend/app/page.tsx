export default function Home() {
  return (
    <main className="flex flex-col">
      <h1 className="text-6xl uppercase font-black font-lovelo text-teal-900">
        BPL PSA Grievance Tracker
      </h1>
      <section>
        <h2 className="text-4xl font-montserrat font-bold text-teal-900">
          Upcoming Deadlines
        </h2>
        <ol>
          <li>
            <div>
              <h3>
                <a href="#">Test Grievance #1</a>
              </h3>
              <p>Waiting to Schedule - January 6, 2026</p>
              <p>Point Person: Walter Reuther</p>
            </div>
          </li>
        </ol>
        <a href="#">See all grievances by deadline</a>
      </section>
      <section>
        <h2 className="text-4xl font-montserrat font-bold text-teal-900">
          Recent Activity
        </h2>
      </section>
    </main>
  );
}
