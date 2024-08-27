import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

@Injectable()
export class AccessTokensService {
  private logger: Logger = new Logger(AccessTokensService.name);
  private expiresIn: string;
  private secretKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + AccessTokensService.name,
    });
    this.expiresIn = this.configService.get<string>("JWT_ACCESS_EXPIRES_IN");
    this.secretKey = this.configService.get<string>("JWT_ACCESS_SECRET_KEY");
  }

  async create(payload: any): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createAccessToken",
        user_id: payload.userId,
        portal: payload.portal,
      });

      const jwtOptions: JwtSignOptions = {
        expiresIn: this.expiresIn,
        secret: this.secretKey,
      };

      const newAccessToken: string = await this.jwtService.signAsync(
        payload,
        jwtOptions,
      );

      if (!newAccessToken) {
        this.logger.warn({
          message: "Failed create new access token",
          user_id: payload.userId,
          portal: payload.portal,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new access token",
        // ).getResponse();
      }

      this.logger.log({
        message: "Access token created successfully",
        token_length: newAccessToken.length,
      });

      return newAccessToken;
    } catch (error) {
      this.logger.error({
        message: "Error creating new access token",
        user_id: payload.userId,
        portal: payload.portal,
        error: error,
      });
      throw error;
    }
  }
}
