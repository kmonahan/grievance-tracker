"use client";

import { useRouter } from "next/navigation";
import { toggleUserStatus } from "./actions";

export interface UserStatusToggleProps {
  userId: number;
  isActive: boolean;
  isCurrentUser: boolean;
}

export function UserStatusToggle({
  userId,
  isActive,
  isCurrentUser,
}: UserStatusToggleProps): React.ReactElement | null {
  const router = useRouter();

  if (userId === 1) return null;

  async function handleClick() {
    const { ok } = await toggleUserStatus(userId, isActive);
    if (ok) {
      router.refresh();
    }
  }

  const isDisabled = isActive && isCurrentUser;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`button px-3 py-1.5 text-sm ${
        isActive ? "bg-destructive text-secondary-foreground " : ""
      }`}
    >
      {isActive ? "Deactivate" : "Reactivate"}
    </button>
  );
}
