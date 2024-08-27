import { pgTable, serial } from "drizzle-orm/pg-core";

const Device = pgTable("devices", {
  id: serial("id").primaryKey(),
  tokens: serial("tokens"),
});

export { Device };
