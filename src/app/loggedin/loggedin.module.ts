import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MONGO_DB_CONNECTION } from "@/db/connection";
import { LOGGEDIN_SCHEMA_NAME, LoggedinSchema } from "@/db/mongo/model";

import { LoggedinService } from ".";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: LOGGEDIN_SCHEMA_NAME, schema: LoggedinSchema }],
      MONGO_DB_CONNECTION.MAIN,
    ),
  ],
  providers: [LoggedinService],
  exports: [LoggedinService],
})
export class LoggedinModule {}
