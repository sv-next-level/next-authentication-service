import { Body, Controller, Logger, Post } from "@nestjs/common";

import { CreateTokenDTO } from "@/dtos";
import { TokenService } from "@/token/token.service";

@Controller("tokens")
export class TokenController {
  private logger: Logger = new Logger("token.controller");

  constructor(private readonly tokenService: TokenService) {
    this.logger.debug({
      message: "Entering constructor of token controller",
    });
  }

  @Post("create")
  async createToken(@Body() tokenDto: CreateTokenDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createToken",
        user_id: tokenDto.userId,
        portal: tokenDto.portal,
      });

      const accessTokenPayload = {
        userId: tokenDto.userId,
        portal: tokenDto.portal,
      };
      const accessToken =
        await this.tokenService.createAccessToken(accessTokenPayload);

      const refreshTokenPayload = {
        userId: tokenDto.userId,
        portal: tokenDto.portal,
      };
      const refreshToken =
        await this.tokenService.createRefreshToken(refreshTokenPayload);

      const hashedTokenPayload = {
        userId: tokenDto.userId,
        portal: tokenDto.portal,
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      };
      const hashedToken: string =
        this.tokenService.createHashedToken(hashedTokenPayload);

      return hashedToken;
    } catch (error: any) {
      this.logger.error({
        message: "Error creating token",
        user_id: tokenDto.userId,
        portal: tokenDto.portal,
        error: error,
      });
      return error;
    }
  }
}
