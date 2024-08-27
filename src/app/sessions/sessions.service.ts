import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CipherService } from "@/nestjs/app/cipher/cipher.service";

import { AccessTokensService } from "../tokens/access-tokens.service";
import { RefreshTokensService } from "../tokens/refresh-tokens.service";

@Injectable()
export class SessionsService {
  private logger: Logger = new Logger(SessionsService.name);

  constructor(
    private readonly cipherService: CipherService,
    private readonly accessTokensService: AccessTokensService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + SessionsService.name,
    });
  }

  async findAll() {
    const token = await this.refreshTokensService.create({
      sub: "123",
      jti: "123fd",
    });

    // const encryptedText = this.cipherService.encryptObject(token);
    // const decryptedText = this.cipherService.decryptObject(encryptedText);

    return token;
    // return encryptedText;
  }
}
