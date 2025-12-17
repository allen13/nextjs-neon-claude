import { neonAuthMiddleware } from "@neondatabase/neon-js/auth/next";

// Middleware to protect routes and refresh sessions
export default neonAuthMiddleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/dashboard/:path*",
    "/notes/:path*",
  ],
};
