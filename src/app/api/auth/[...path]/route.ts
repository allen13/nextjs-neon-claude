import { authApiHandler } from "@neondatabase/neon-js/auth/next";

// Export handlers for all auth routes
// This handles: /api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out, etc.
export const { GET, POST, PUT, DELETE, PATCH } = authApiHandler();
