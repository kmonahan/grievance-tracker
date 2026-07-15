import { cookies } from "next/headers";
import Link from "next/link";
import NavMenu from "./NavMenu";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("access_token");

  return (
    <header className="relative w-full border-b border-border bg-neutral-0/90">
      <div className="w-full mx-auto px-5 md:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-title text-xl md:text-3xl lg:text-5xl uppercase text-primary font-extrabold tracking-tight hover:text-hover transition-colors"
        >
          BLU Grievance Tracker
        </Link>
        {isLoggedIn && <NavMenu />}
      </div>
    </header>
  );
}
