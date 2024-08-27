import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import defaultConfiguration from "@/config";
import nestConfiguration, { validate } from "@/nestjs/config";

import { DevicesModule } from "@/app/devices/devices.module";
import { SessionsModule } from "@/app/sessions/sessions.module";
import { TokensModule } from "@/app/tokens/tokens.module";

// import { RedisDatabaseModule } from "@/nestjs/db/redis/database.module";
// import { DrizzleDatabaseModule } from "@/nestjs/db/postgres/drizzle/database.module";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...defaultConfiguration, ...nestConfiguration],
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    DevicesModule,
    SessionsModule,
    TokensModule,
    // RedisDatabaseModule,
    // DrizzleDatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
