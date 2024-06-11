import { Body, Controller, Logger, Post } from "@nestjs/common";

import { TokenService } from ".";
import { CreateTokenDTO } from "@/dto";
import { Created, IApiResponse, InternalServerError } from "@/utils";

@Controller("tokens")
export class TokenController {
  private logger: Logger = new Logger("token.controller");

  constructor(private readonly tokenService: TokenService) {
    this.logger.debug({
      message: "Entering constructor of token controller",
    });
  }

  @Post("create")
  async createToken(@Body() tokenDto: CreateTokenDTO): Promise<IApiResponse> {
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

      const data = {
        message: "Hashed token created",
        token: hashedToken,
      };

      return Created(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error creating token",
        user_id: tokenDto.userId,
        portal: tokenDto.portal,
        error: error,
      });

      return InternalServerError(error);
    }
  }
}
