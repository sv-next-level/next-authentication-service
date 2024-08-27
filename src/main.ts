import {
  INestApplication,
  Logger,
  ValidationPipe,
  ValidationPipeOptions,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "@/app.module";

const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
};

async function bootstrap() {
  const logger: Logger = new Logger("main");

  const app: INestApplication<any> =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);
  const PORT: number = configService.get<number>("PORT");
  const ENV: string = configService.get<string>("NODE_ENV");

  const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
    .setTitle("Authentication Service")
    .setDescription("This is Authentication Service Swagger API Description")
    .setVersion("1.0")
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    useGlobalPrefix: true,
    swaggerUiEnabled: true,
    customSiteTitle: "Authentication Service | Next Level API",
  });

  await app.listen(PORT);

  logger.verbose(`\nENV: ${ENV}\nPORT: ${PORT}\nURL: ${await app.getUrl()}\n`);
}

bootstrap();
