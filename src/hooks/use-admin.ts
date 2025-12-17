"use client";

import { authClient } from "@/lib/auth/client";

export function useAdmin() {
  const { data: session, isPending } = authClient.useSession();

  const role = session?.user?.role as string | undefined;
  const isAdmin = role === "admin";
  const isModerator = role === "moderator";
  const isAdminOrModerator = isAdmin || isModerator;

  return {
    session,
    user: session?.user,
    isPending,
    isAdmin,
    isModerator,
    isAdminOrModerator,
    role: role || "user",
  };
}
