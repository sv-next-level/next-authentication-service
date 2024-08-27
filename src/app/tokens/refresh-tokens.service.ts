import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

@Injectable()
export class RefreshTokensService {
  private logger: Logger = new Logger(RefreshTokensService.name);
  private expiresIn: string;
  private secretKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + RefreshTokensService.name,
    });
    this.expiresIn = this.configService.get<string>("JWT_REFRESH_EXPIRES_IN");
    this.secretKey = this.configService.get<string>("JWT_REFRESH_SECRET_KEY");
  }

  async create(payload: any): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createRefreshToken",
        user_id: payload.userId,
        portal: payload.portal,
      });

      const jwtOptions: JwtSignOptions = {
        expiresIn: this.expiresIn,
        secret: this.secretKey,
      };

      const newRefreshToken: string = await this.jwtService.signAsync(
        payload,
        jwtOptions,
      );

      if (!newRefreshToken) {
        this.logger.warn({
          message: "Failed create new hashed token",
          user_id: payload.userId,
          portal: payload.portal,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new refresh token",
        // ).getResponse();
      }

      this.logger.log({
        message: "Refresh token created successfully",
        token_length: newRefreshToken.length,
      });

      return newRefreshToken;
    } catch (error) {
      this.logger.error({
        message: "Error creating new refresh token",
        user_id: payload.userId,
        portal: payload.portal,
        error: error,
      });
      throw error;
    }
  }
}
