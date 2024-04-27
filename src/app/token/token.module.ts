import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { TokenService } from "@/app/token/token.service";
import { CipherService } from "@/app/cipher/cipher.service";

@Module({
  providers: [TokenService, JwtService, CipherService],
  exports: [TokenService],
})
export class TokenModule {}
