import { neonAuthMiddleware } from "@neondatabase/neon-js/auth/next";

// Middleware for session refresh only (not route protection)
// Route protection is handled client-side due to session detection issues
export default neonAuthMiddleware({});

export const config = {
  matcher: [
    // Only run on API routes for session refresh
    "/api/:path*",
  ],
};
