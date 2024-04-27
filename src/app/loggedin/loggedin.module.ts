import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LoggedinService } from ".";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { LOGGEDIN_MODEL, loggedinSchema } from "@/schemas";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: LOGGEDIN_MODEL, schema: loggedinSchema }],
      DATABASE_CONNECTION_NAME.AUTH_SERVICE_DB
    ),
  ],
  providers: [LoggedinService],
  exports: [LoggedinService],
})
export class LoggedinModule {}