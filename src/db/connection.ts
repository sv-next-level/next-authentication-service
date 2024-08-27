import { Device } from "@/app/devices/entities/device.drizzle.entity";
import { Session } from "@/app/sessions/entities/session.drizzle.entity";

import { CONNECTION } from "@/common/db/mongo/connection";

export enum MONGO_DB_CONNECTION {}

export const MONGOOSE_DB_SCHEMA = {};

export enum REDIS_DB_CONNECTION {}

export enum POSTGRES_DB_CONNECTION {
  MAIN = CONNECTION.AUTHENTICATION_SERVICE_MAIN,
}

export const POSTGRES_DB_SCHEMA = {
  Device,
  Session,
};

export const POSTGRES_DB_SCHEMA_PATH = [
  "./src/app/devices/entity/**.drizzle.entity.ts",
  "./src/app/sessions/entity/**.drizzle.entity.ts",
];
