import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setAdminRole(email: string) {
  console.log(`Looking up user with email: ${email}`);

  // Find user by email in Neon Auth's user table
  const users = await sql`
    SELECT id, name, email, role
    FROM neon_auth."user"
    WHERE email = ${email}
  `;

  if (users.length === 0) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  const user = users[0];
  console.log(`Found user: ${user.name || user.email} (${user.id})`);
  console.log(`Current role: ${user.role || "user"}`);

  if (user.role === "admin") {
    console.log("User is already an admin.");
    return;
  }

  // Set admin role directly in database
  console.log("Setting admin role...");
  await sql`
    UPDATE neon_auth."user"
    SET role = 'admin'
    WHERE email = ${email}
  `;

  console.log(`Successfully set admin role for ${email}`);
}

// Get email from CLI args
const email = process.argv[2];

if (!email) {
  console.error("Usage: bun scripts/set-admin.ts <email>");
  console.error("Example: bun scripts/set-admin.ts user@example.com");
  process.exit(1);
}

// Validate email format
if (!email.includes("@")) {
  console.error("Error: Invalid email format");
  process.exit(1);
}

setAdminRole(email);
