import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

import { Session } from "@/app/sessions/entities/session.drizzle.entity";

export const Device = pgTable(
  "devices",
  {
    _id: uuid("_id").defaultRandom().primaryKey(),

    tokens: varchar("tokens", {
      length: 5000,
    }),

    metadata: json("metadata").notNull(),

    updated_at: timestamp("updated_at", {
      mode: "date",
      precision: 6,
      withTimezone: true,
    })
      .$onUpdate(() => new Date())
      .notNull(),

    created_at: timestamp("created_at", {
      mode: "date",
      precision: 6,
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tokensIndex: index("tokens_index")
      .on(table.tokens)
      .where(sql`tokens IS NOT NULL`),
  }),
);

export const deviceRelations = relations(Device, ({ one }) => ({
  session: one(Session, {
    fields: [Device._id],
    references: [Session.device_id],
    relationName: "one_session_to_many_device",
  }),
}));
