"use client";

import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";

if (!process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL) {
  throw new Error("NEXT_PUBLIC_NEON_AUTH_BASE_URL is not defined");
}

if (!process.env.NEXT_PUBLIC_NEON_DATA_API_URL) {
  throw new Error("NEXT_PUBLIC_NEON_DATA_API_URL is not defined");
}

// Create the unified Neon client for both Auth and Data API
// JWT token is automatically injected for authenticated requests
export const neonClient = createClient({
  auth: {
    url: process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL,
    adapter: BetterAuthReactAdapter(),
  },
  dataApi: {
    url: process.env.NEXT_PUBLIC_NEON_DATA_API_URL,
  },
});
