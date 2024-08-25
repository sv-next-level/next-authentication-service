import { ModelDefinition } from "@nestjs/mongoose";

import { CONNECTION } from "@/common/db/mongo/connection";

export interface MongooseDbSchema {
  connectionName: string;
  models: ModelDefinition[];
}

export enum MONGO_DB_CONNECTION {
  MAIN = CONNECTION.AUTHENTICATION_SERVICE_MAIN,
}

export const MONGOOSE_DB_SCHEMA = {};

export enum REDIS_DB_CONNECTION {
  MAIN = CONNECTION.AUTHENTICATION_SERVICE_MAIN,
}

export enum POSTGRES_DB_CONNECTION {
  MAIN = CONNECTION.TEST_CONN_MAIN + "N",
}
export const POSTGRES_DB_SCHEMA = {
  // articles,
};
export const POSTGRES_DB_SCHEMA_PATH = [
  "./src/app/articles/entity/articles.entity.ts",
];
