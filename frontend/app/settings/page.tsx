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
    href: "/register",
    label: "Register New User",
    description: "Create a new user account",
  },
];

export default function SettingsPage(): React.ReactElement {
  return (
    <main className="px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-title text-3xl text-primary">Settings</h1>
        <ul className="space-y-3">
          {settingsLinks.map(({ href, label, description }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col gap-1 rounded-xl border-2 border-border bg-card px-5 py-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
              >
                <span className="font-subtitle font-semibold text-base text-foreground">
                  {label}
                </span>
                <span className="font-body text-sm text-muted-foreground">
                  {description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
