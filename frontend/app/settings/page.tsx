import Link from "next/link";

const settingsLinks = [
  {
    href: "/settings/holidays",
    label: "Holidays",
    description: "Manage holidays that affect grievance deadlines",
  },
  {
    href: "/settings/users",
    label: "Users",
    description: "View and manage user accounts",
  },
  {
    href: "/settings/stages",
    label: "Stages",
    description: "Manage due dates for grievance stages",
  },
  {
    href: "/register",
    label: "Register New User",
    description: "Create a new user account",
  },
];

export default function SettingsPage(): React.ReactElement {
  return (
    <main className="px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-title text-3xl md:text-4xl uppercase font-bold text-primary-foreground">
          Settings
        </h1>
        <ul className="flex flex-col gap-4">
          {settingsLinks.map(({ href, label, description }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-lg border border-border bg-card p-4 relative group transition-all hover:border-tertiary hover:shadow-md focus"
              >
                <h2 className="font-subtitle font-semibold text-lg text-primary group-hover:text-hover">
                  {label}
                </h2>
                <p className="font-body text-base text-muted-foreground">
                  {description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
