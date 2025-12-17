"use client";

import { UserButton as NeonUserButton } from "@neondatabase/neon-js/auth/react/ui";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function UserButton() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />;
  }

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    );
  }

  return <NeonUserButton size="icon" />;
}
