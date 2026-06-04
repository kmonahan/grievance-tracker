import Link from "next/link";
import { getAccessToken } from "~/app/lib/auth";
import { UserStatusToggle } from "./UserStatusToggle";

type User = {
  id: number;
  name: string;
  is_active: boolean;
};

export default async function UsersPage(): Promise<React.ReactElement> {
  const token = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { tags: ["users"] },
  });

  const data = await response.json();
  const users: User[] = data.users;

  // TODO: replace with actual current user lookup
  const currentUserId: number | null = null;

  return (
    <main className="px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-title text-3xl text-primary">Users</h1>
      </div>

      {users.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card py-12 text-center">
          <p className="font-subtitle text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-4 rounded-xl border-2 border-border bg-card px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`size-2 rounded-full shrink-0 ${
                    user.is_active ? "bg-accent" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <span
                    className={`font-subtitle font-semibold truncate block ${
                      user.is_active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {user.name}
                  </span>
                  <span
                    className={`text-sm font-body ${
                      user.is_active
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/settings/edit-user/${user.id}`}
                  className="rounded-lg px-4 py-2 text-sm font-subtitle font-semibold border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
                >
                  Edit
                </Link>
                <UserStatusToggle
                  userId={user.id}
                  isActive={user.is_active}
                  isCurrentUser={user.id === currentUserId}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
