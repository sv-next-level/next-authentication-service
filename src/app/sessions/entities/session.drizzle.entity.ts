import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

import { Device } from "@/app/devices/entities/device.drizzle.entity";
import { SESSION_STATUS } from "@/app/sessions/entities/sessions.enum";

export const SessionStatusEnum = pgEnum("status", [
  SESSION_STATUS.ACTIVE,
  SESSION_STATUS.EXPIRED,
  SESSION_STATUS.LOGOUT_ALL,
  SESSION_STATUS.LOGOUT_FORCE,
  SESSION_STATUS.LOGOUT_SELF,
  SESSION_STATUS.PW_CHANGE,
  SESSION_STATUS.PW_FORGOT,
]);

export const Session = pgTable(
  "sessions",
  {
    _id: uuid("_id").defaultRandom().primaryKey(),

    user_id: varchar("user_id", {
      length: 30,
    }).notNull(),

    device_id: uuid("device_id").references(() => Device._id),

    token: varchar("token", {
      length: 3000,
    }).notNull(),

    status: SessionStatusEnum("status")
      .$defaultFn(() => SessionStatusEnum.enumValues[0])
      .notNull(),

    metadata: json("metadata").notNull(),

    last_used_at: timestamp("last_used_at", {
      mode: "date",
      precision: 6,
      withTimezone: true,
    }).notNull(),

    expires_at: timestamp("expires_at", {
      mode: "date",
      precision: 6,
      withTimezone: true,
    }).notNull(),

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
    tokenIndex: index("token_index")
      .on(table.token)
      .where(sql`status='ACTIVE'`),
  }),
);

export const sessionRelations = relations(Session, ({ many }) => ({
  devices: many(Device),
}));
