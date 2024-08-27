import { pgTable, serial } from "drizzle-orm/pg-core";

const Session = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").$type<String>().notNull(),
  device_id: serial("device_id").$type<String>().notNull(),
  refresh_token: serial("refresh_token").$type<String>().notNull(),
  status: serial("status").$type<String>().notNull(),
  meta_data: serial("meta_data").$type<String>().notNull(),
  last_used_at: serial("last_used_at").$type<String>().notNull(),
  expires_at: serial("expires_at").$type<String>().notNull(),
  updated_at: serial("updated_at").$type<String>().notNull(),
  issued_at: serial("issued_at").default(Date.now()),
});

export { Session };
