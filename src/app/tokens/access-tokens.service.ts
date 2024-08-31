import * as jwt from "jsonwebtoken";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";

import { ms, StringValue } from "@/common/functions";

@Injectable()
export class AccessTokensService {
  private logger: Logger = new Logger(AccessTokensService.name);
  private expiresIn: StringValue;
  private secretKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + AccessTokensService.name,
    });
    this.expiresIn = this.configService.get<StringValue>(
      "JWT_ACCESS_EXPIRES_IN",
    );
    this.secretKey = this.configService.get<string>("JWT_ACCESS_SECRET_KEY");
  }

  async create(payload: any): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering create " + AccessTokensService.name,
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
          message: "Failed create new access token " + AccessTokensService.name,
          user_id: payload.userId,
          portal: payload.portal,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new access token",
        // ).getResponse();
      }

      this.logger.log({
        message:
          "Access token created successfully " + AccessTokensService.name,
        token_length: newAccessToken.length,
      });

      return newAccessToken;
    } catch (error) {
      this.logger.error({
        message: "Error creating new access token " + AccessTokensService.name,
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
        message: "Entering decode " + AccessTokensService.name,
        token: token,
      });

      const jwtOptions: jwt.DecodeOptions = {
        complete: false,
        json: true,
      };

      const decodedAccessToken = await this.jwtService.decode(
        token,
        jwtOptions,
      );

      if (!decodedAccessToken) {
        this.logger.warn({
          message: "Failed decode access token " + AccessTokensService.name,
          token: token,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new access token",
        // ).getResponse();
      }

      this.logger.log({
        message:
          "Access token decoded successfully " + AccessTokensService.name,
        decoded_token_length: decodedAccessToken.length,
      });

      return decodedAccessToken;
    } catch (error) {
      this.logger.error({
        message: "Error decoding access token " + AccessTokensService.name,
        error: error,
      });
      throw error;
    }
  }
  async verify(token: string): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering verify " + AccessTokensService.name,
        token: token,
      });

      const jwtOptions: JwtVerifyOptions = {
        complete: false,
        secret: this.secretKey,
      };

      const verifiedAccessToken = await this.jwtService.verifyAsync(
        token,
        jwtOptions,
      );

      if (!verifiedAccessToken) {
        this.logger.warn({
          message: "Failed verify access token " + AccessTokensService.name,
          token: token,
        });
        // throw new InternalServerErrorException(
        //   "Failed create new access token",
        // ).getResponse();
      }

      this.logger.log({
        message:
          "Access token verified successfully " + AccessTokensService.name,
        verified_token_key: Object.keys(verifiedAccessToken),
      });

      return verifiedAccessToken;
    } catch (error) {
      this.logger.error({
        message: "Error verifing access token " + AccessTokensService.name,
        error: error,
      });
      throw error;
    }
  }

  compromise(token: any): boolean {
    try {
      this.logger.debug({
        message: "Entering compromise " + AccessTokensService.name,
        token: token,
      });

      const sub = token.sub;
      const jti = token.jti;
      const iat = token.iat;
      const exp = token.exp;
      const gap = ms(this.expiresIn) / 1000;
      let accessTokenCompromised: boolean = false;

      if (!sub || !jti || !iat || !exp || iat > exp || exp - iat !== gap) {
        // logout user or create a new access token
        accessTokenCompromised = true;
        // throw new InternalServerErrorException("Access token compromised!");
      }

      return accessTokenCompromised;
    } catch (error) {
      this.logger.error({
        message:
          "Error checking compromisation of access token " +
          AccessTokensService.name,
        error: error,
      });
      throw error;
    }
  }

  expiry(token: any): boolean {
    try {
      this.logger.debug({
        message: "Entering expiry " + AccessTokensService.name,
        token: token,
      });

      // check expired or not
      const expDate = new Date(token.exp * 1000).getTime();
      const curDate = new Date().getTime();
      let accessTokenExpired: boolean = false;
      if (curDate > expDate) {
        accessTokenExpired = true;
        // throw new InternalServerErrorException("Access token expired!");
      }

      return accessTokenExpired;
    } catch (error) {
      this.logger.error({
        message:
          "Error checking expiry of access token " + AccessTokensService.name,
        error: error,
      });
      throw error;
    }
  }
}
