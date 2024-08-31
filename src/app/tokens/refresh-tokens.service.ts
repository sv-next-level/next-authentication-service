import * as jwt from "jsonwebtoken";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";

import { ms, StringValue } from "@/common/functions";

@Injectable()
export class RefreshTokensService {
  private logger: Logger = new Logger(RefreshTokensService.name);
  private expiresIn: StringValue;
  private secretKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + RefreshTokensService.name,
    });
    this.expiresIn = this.configService.get<StringValue>(
      "JWT_REFRESH_EXPIRES_IN",
    );
    this.secretKey = this.configService.get<string>("JWT_REFRESH_SECRET_KEY");
  }

  async create(payload: any): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering create " + RefreshTokensService.name,
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
          message:
            "Failed create new hashed token " + RefreshTokensService.name,
          user_id: payload.userId,
          portal: payload.portal,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new refresh token",
        // ).getResponse();
      }

      this.logger.log({
        message:
          "Refresh token created successfully " + RefreshTokensService.name,
        token_length: newRefreshToken.length,
      });

      return newRefreshToken;
    } catch (error) {
      this.logger.error({
        message:
          "Error creating new refresh token " + RefreshTokensService.name,
        user_id: payload.userId,
        portal: payload.portal,
        error: error,
      });
      throw error;
    }
  }

  async decode(token: string): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering decode " + RefreshTokensService.name,
        token: token,
      });

      const jwtOptions: jwt.DecodeOptions = {
        complete: false,
        json: true,
      };

      const decodedRefreshToken = await this.jwtService.decode(
        token,
        jwtOptions,
      );

      if (!decodedRefreshToken) {
        this.logger.warn({
          message: "Failed decode refresh token " + RefreshTokensService.name,
          token: token,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new refresh token",
        // ).getResponse();
      }

      this.logger.log({
        message:
          "Refresh token decoded successfully " + RefreshTokensService.name,
        decoded_token_keys: Object.keys(decodedRefreshToken),
      });

      return decodedRefreshToken;
    } catch (error) {
      this.logger.error({
        message: "Error decoding refresh token " + RefreshTokensService.name,
        error: error,
      });
      throw error;
    }
  }

  async verify(token: string): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering verify " + RefreshTokensService.name,
        token: token,
      });

      const jwtOptions: JwtVerifyOptions = {
        complete: false,
        secret: this.secretKey,
      };

      const verifiedRefreshToken = await this.jwtService.verifyAsync(
        token,
        jwtOptions,
      );

      if (!verifiedRefreshToken) {
        this.logger.warn({
          message: "Failed verify refresh token " + RefreshTokensService.name,
          token: token,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new refresh token",
        // ).getResponse();
      }

      this.logger.log({
        message:
          "Refresh token verified successfully " + RefreshTokensService.name,
        verified_token_key: Object.keys(verifiedRefreshToken),
      });

      return verifiedRefreshToken;
    } catch (error) {
      this.logger.error({
        message: "Error verifing refresh token " + RefreshTokensService.name,
        error: error,
      });
      throw error;
    }
  }

  compromise(token: any): boolean {
    try {
      this.logger.debug({
        message: "Entering compromise " + RefreshTokensService.name,
        token: token,
      });

      const sub = token.sub;
      const jti = token.jti;
      const iat = token.iat;
      const exp = token.exp;
      const gap = ms(this.expiresIn) / 1000;
      let refreshTokenCompromised: boolean = false;

      if (!sub || !jti || !iat || !exp || iat > exp || exp - iat !== gap) {
        // logout user or create a new refresh token
        refreshTokenCompromised = true;
        // throw new InternalServerErrorException("Refresh token compromised!");
      }

      return refreshTokenCompromised;
    } catch (error) {
      this.logger.error({
        message:
          "Error checking compromisation of refresh token " +
          RefreshTokensService.name,
        error: error,
      });
      throw error;
    }
  }

  expiry(token: any): boolean {
    try {
      this.logger.debug({
        message: "Entering expiry " + RefreshTokensService.name,
        token: token,
      });

      // check expired or not
      const expDate = new Date(token.exp * 1000).getTime();
      const curDate = new Date().getTime();
      let refreshTokenExpired: boolean = false;
      if (curDate > expDate) {
        refreshTokenExpired = true;
        // throw new InternalServerErrorException("Refresh token expired!");
      }

      return refreshTokenExpired;
    } catch (error) {
      this.logger.error({
        message:
          "Error checking expiry of refresh token " + RefreshTokensService.name,
        error: error,
      });
      throw error;
    }
  }
}
