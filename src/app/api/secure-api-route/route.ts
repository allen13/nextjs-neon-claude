import { neonAuth } from "@neondatabase/neon-js/auth/next";

export async function GET() {
  const { session, user } = await neonAuth();
  return new Response(JSON.stringify({ session: session, user: user }), {
    headers: { "Content-Type": "application/json" },
  });
}
