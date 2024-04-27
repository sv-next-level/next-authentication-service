import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import configuration, { validate } from "@/config";
import { TokenModule } from "@/app/token/token.module";
import { CipherModule } from "@/app/cipher/cipher.module";
import { TokenController } from "@/app/token/token.controller";
import { LoggedinModule } from "@/app/loggedin/loggedin.module";
import { DatabaseModule } from "@/infra/mongoose/database.module";
import { LoggedinController } from "@/app/loggedin/loggedin.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    TokenModule,
    CipherModule,
    LoggedinModule,
    DatabaseModule,
  ],
  controllers: [AppController, TokenController, LoggedinController],
  providers: [AppService],
})
export class AppModule {}
