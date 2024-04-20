import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongooseAuthServiceConfigService } from "@/infra/mongoose/mongoose-config.service";
import { DATABASE_CONNECTION_NAME } from "@/constants";

@Module({
  imports: [
    // Database `APP` connection factory provider
    MongooseModule.forRootAsync({
      useClass: MongooseAuthServiceConfigService,
      connectionName: DATABASE_CONNECTION_NAME.AUTH_SERVICE_DB,
    }),

    // Database `ADMIN` connection factory provider
    // MongooseModule.forRootAsync({
    //   useClass: MongooseAdminConfigService,
    //   connectionName: DATABASE_CONNECTION.ADMIN,
    // }),
  ],

  exports: [MongooseModule],
})
export class DatabaseModule {}
