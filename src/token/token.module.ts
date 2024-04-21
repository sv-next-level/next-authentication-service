import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { TokenService } from "@/token/token.service";
import { CipherService } from "@/cipher/cipher.service";

@Module({
  providers: [TokenService, JwtService, CipherService, ConfigService],
  exports: [TokenService],
})
export class TokenModule {}
