import { Module } from "@nestjs/common";

import { CipherService } from ".";

@Module({
  providers: [CipherService],
  exports: [CipherService],
})
export class CipherModule {}
