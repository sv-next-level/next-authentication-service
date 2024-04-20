import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DATABASE_CONNECTION_NAME } from "@/constants";

@Injectable()
export class MongooseAuthServiceConfigService
  implements MongooseOptionsFactory
{
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const uri = this.configService.get(
      `${DATABASE_CONNECTION_NAME.AUTH_SERVICE_DB}.dbUri`
    );

    return {
      uri,
    };
  }
}
