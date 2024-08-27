import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { SessionsController } from "@/app/sessions/sessions.controller";
import { SessionsService } from "@/app/sessions/sessions.service";
import { AccessTokensService } from "@/app/tokens/access-tokens.service";
import { RefreshTokensService } from "@/app/tokens/refresh-tokens.service";
import { CipherService } from "@/nestjs/app/cipher/cipher.service";

@Module({
  controllers: [SessionsController],
  providers: [
    SessionsService,
    CipherService,
    JwtService,
    AccessTokensService,
    RefreshTokensService,
  ],
})
export class SessionsModule {}