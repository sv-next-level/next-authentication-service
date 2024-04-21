import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import configuration, { validate } from "@/config";
import { TokenModule } from "@/token/token.module";
import { CipherModule } from "@/cipher/cipher.module";
import { TokenController } from "@/token/token.controller";
import { LoggedinModule } from "@/loggedin/loggedin.module";
import { DatabaseModule } from "@/infra/mongoose/database.module";
import { LoggedinController } from "@/loggedin/loggedin.controller";

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
