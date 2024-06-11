import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LoggedinService } from ".";
import { MONGOOSE_DB_CONNECTION } from "@/db/connection";
import { LOGGEDIN_SCHEMA_NAME, LoggedinSchema } from "@/db/mongo/model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: LOGGEDIN_SCHEMA_NAME, schema: LoggedinSchema }],
      MONGOOSE_DB_CONNECTION.MAIN
    ),
  ],
  providers: [LoggedinService],
  exports: [LoggedinService],
})
export class LoggedinModule {}
