import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { AccessTokenDTO, HashedTokenDTO, RefreshTokenDTO } from "@/dto";

import { CipherService } from "@/app/cipher/cipher.service";

@Injectable()
export class TokenService {
  private logger: Logger = new Logger("token.service");

  constructor(
    private readonly jwtService: JwtService,
    private readonly cipherService: CipherService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of token service",
    });
  }

  async createAccessToken(tokenPayload: AccessTokenDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createAccessToken",
        user_id: tokenPayload.userId,
        portal: tokenPayload.portal,
      });

      const expiresInTime: string = this.configService.get<string>(
        "JWT_ACCESS_EXPIRES_IN",
      );
      const secretKey: string = this.configService.get<string>(
        "JWT_ACCESS_SECRET_KEY",
      );

      const jwtOptions: JwtSignOptions = {
        expiresIn: expiresInTime,
        secret: secretKey,
      };

      const newAccessToken: string = await this.jwtService.signAsync(
        tokenPayload,
        jwtOptions,
      );

      if (!newAccessToken) {
        this.logger.warn({
          message: "Failed create new access token",
          user_id: tokenPayload.userId,
          portal: tokenPayload.portal,
        });
        throw new InternalServerErrorException(
          "Failed create new access token",
        ).getResponse();
      }

      this.logger.log({
        message: "Access token created successfully",
        token_length: newAccessToken.length,
      });

      return newAccessToken;
    } catch (error) {
      this.logger.error({
        message: "Error creating new access token",
        user_id: tokenPayload.userId,
        portal: tokenPayload.portal,
        error: error,
      });
      throw error;
    }
  }

  async createRefreshToken(tokenPayload: RefreshTokenDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createRefreshToken",
        user_id: tokenPayload.userId,
        portal: tokenPayload.portal,
      });

      const expiresInTime: string = this.configService.get<string>(
        "JWT_REFRESH_EXPIRES_IN",
      );
      const secretKey: string = this.configService.get<string>(
        "JWT_REFRESH_SECRET_KEY",
      );

      const jwtOptions: JwtSignOptions = {
        expiresIn: expiresInTime,
        secret: secretKey,
      };

      const newRefreshToken: string = await this.jwtService.signAsync(
        tokenPayload,
        jwtOptions,
      );

      if (!newRefreshToken) {
        this.logger.warn({
          message: "Failed create new hashed token",
          user_id: tokenPayload.userId,
          portal: tokenPayload.portal,
        });
        throw new InternalServerErrorException(
          "Failed create new refresh token",
        ).getResponse();
      }

      this.logger.log({
        message: "Refresh token created successfully",
        token_length: newRefreshToken.length,
      });

      return newRefreshToken;
    } catch (error) {
      this.logger.error({
        message: "Error creating new refresh token",
        user_id: tokenPayload.userId,
        portal: tokenPayload.portal,
        error: error,
      });
      throw error;
    }
  }

  createHashedToken(tokenPayload: HashedTokenDTO): string {
    try {
      this.logger.debug({
        message: "Entering createHashedToken",
        user_id: tokenPayload.userId,
        portal: tokenPayload.portal,
      });

      const newHashedToken: string =
        this.cipherService.encryptObject(tokenPayload);

      if (!newHashedToken) {
        this.logger.warn({
          message: "Failed create new hashed token",
          user_id: tokenPayload.userId,
          portal: tokenPayload.portal,
        });
        throw new InternalServerErrorException(
          "Failed create new hashed token",
        ).getResponse();
      }

      this.logger.log({
        message: "Hashed token created successfully",
        token_length: newHashedToken.length,
      });

      return newHashedToken;
    } catch (error) {
      this.logger.error({
        message: "Error creating new hashed token",
        user_id: tokenPayload.userId,
        portal: tokenPayload.portal,
        error: error,
      });
      throw error;
    }
  }
}
