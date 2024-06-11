import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import defaultConfiguration from "@/config";
import { AppController } from "@/app.controller";
import { TokenModule } from "@/app/token/token.module";
import { CipherModule } from "@/app/cipher/cipher.module";
import nestConfiguration, { validate } from "@/nestjs/config";
import { TokenController } from "@/app/token/token.controller";
import { LoggedinModule } from "@/app/loggedin/loggedin.module";
import { LoggedinController } from "@/app/loggedin/loggedin.controller";
// import { RedisDatabaseModule } from "@/nestjs/db/redis/database.module";
import { MongooseDatabaseModule } from "@/nestjs/db/mongo/database.module";
import { MongooseModelsModule } from "@/nestjs/db/mongo/mongoose-models.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...defaultConfiguration, ...nestConfiguration],
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    TokenModule,
    CipherModule,
    LoggedinModule,
    // RedisDatabaseModule,
    MongooseModelsModule,
    MongooseDatabaseModule,
  ],
  controllers: [AppController, TokenController, LoggedinController],
  providers: [AppService],
})
export class AppModule {}
