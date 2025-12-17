import { sql } from "drizzle-orm";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().default(sql`(auth.user_id())`),
    title: text("title").notNull(),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ],
);

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
