import { authApiHandler } from "@neondatabase/neon-js/auth/next";

// Export handlers for all auth routes
// This handles: /api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out, etc.
//
// NOTE: Organization limit configuration
// Neon Auth is a managed service. To change the organization limit (default: 5 per user),
// configure it in your Neon Console under Auth settings, or contact Neon support
// if the option is not available in the dashboard.
export const { GET, POST, PUT, DELETE, PATCH } = authApiHandler();
