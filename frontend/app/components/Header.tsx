import { cookies } from "next/headers";
import Link from "next/link";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("access_token");

  return (
    <header className="w-full border-b border-border bg-card">
      <div className="w-full mx-auto px-5 md:px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-title text-4xl text-primary font-bold tracking-tight hover:text-teal-700 transition-colors"
        >
          BPL PSA Grievance Tracker
        </Link>
        {isLoggedIn && (
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/"
                  className="font-body text-sm text-muted-foreground tracking-wide hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/logout"
                  className="font-body text-sm text-muted-foreground tracking-wide hover:text-primary transition-colors"
                >
                  Log Out
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
