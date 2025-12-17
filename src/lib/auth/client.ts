"use client";

import { createAuthClient } from "@neondatabase/neon-js/auth";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";

if (!process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL) {
  throw new Error("NEXT_PUBLIC_NEON_AUTH_BASE_URL is not defined");
}

// Create the auth client with React adapter for hooks support
// Neon Auth includes admin, organization, jwt, and emailOTP plugins by default
export const authClient = createAuthClient(
  process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL,
  {
    adapter: BetterAuthReactAdapter(),
  },
);
