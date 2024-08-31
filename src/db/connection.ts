import { Device } from "@/app/devices/entities/device.drizzle.entity";
import { Session } from "@/app/sessions/entities/session.drizzle.entity";

import { CONNECTION as PG_CONNECTION } from "@/common/db/postgres/connection";

export enum MONGO_DB_CONNECTION {}

export const MONGOOSE_DB_SCHEMA = {};

export enum REDIS_DB_CONNECTION {}

export enum POSTGRES_DB_CONNECTION {
  MAIN = PG_CONNECTION.AUTHENTICATION_SERVICE_MAIN,
}

export const POSTGRES_DB_SCHEMA = {
  Device,
  Session,
};

export const POSTGRES_DB_SCHEMA_PATH = [
  "./src/app/devices/entities/**.drizzle.entity.ts",
  "./src/app/sessions/entities/**.drizzle.entity.ts",
];
