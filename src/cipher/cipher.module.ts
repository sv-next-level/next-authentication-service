import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CipherService } from "@/cipher/cipher.service";

@Module({
  providers: [CipherService, ConfigService],
  exports: [CipherService],
})
export class CipherModule {}
