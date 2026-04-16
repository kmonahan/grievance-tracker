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
}: UserStatusToggleProps): React.ReactElement {
  const router = useRouter();

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
      className={`shrink-0 rounded-lg px-4 py-2 text-sm font-subtitle font-semibold transition-all disabled:pointer-events-none disabled:opacity-40 ${
        isActive
          ? "border-2 border-destructive text-destructive hover:bg-destructive hover:text-primary-foreground"
          : "border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
      }`}
    >
      {isActive ? "Deactivate" : "Reactivate"}
    </button>
  );
}
