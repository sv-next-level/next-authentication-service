import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { CipherService } from "@/app/cipher/cipher.service";
import { TokenService } from "@/app/token/token.service";

@Module({
  providers: [TokenService, JwtService, CipherService],
  exports: [TokenService],
})
export class TokenModule {}
