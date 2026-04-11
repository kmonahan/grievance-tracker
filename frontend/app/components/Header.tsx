import { cookies } from "next/headers";
import Link from "next/link";
import NavMenu from "./NavMenu";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("access_token");

  return (
    <header className="relative w-full border-b border-border bg-card">
      <div className="w-full mx-auto px-5 md:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-title text-2xl md:text-4xl lg:text-5xl text-primary font-bold tracking-tight hover:text-teal-700 transition-colors"
        >
          BPL PSA Grievance Tracker
        </Link>
        {isLoggedIn && <NavMenu />}
      </div>
    </header>
  );
}
