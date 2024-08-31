import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Version,
} from "@nestjs/common";

import { DevicesService } from "@/app/devices/devices.service";
import { SessionsService } from "@/app/sessions/sessions.service";
import { AccessTokensService } from "@/app/tokens/access-tokens.service";
import { RefreshTokensService } from "@/app/tokens/refresh-tokens.service";
import { CipherService } from "@/nestjs/app/cipher/cipher.service";

import { API } from "@/common/api/next-authentication-service/routes";
import {
  SessionCreationBody,
  // SessionCreationHeaders,
  SessionVerificationBody,
  // SessionVerificationHeaders,
} from "@/common/api/next-authentication-service/types";

import { isEmptyObject } from "@/shared/common/ts/functions";

import { SESSION_STATUS } from "./entities/sessions.enum";

@Controller("sessions")
export class SessionsController {
  private logger: Logger = new Logger(SessionsController.name);

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly devicesService: DevicesService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly accessTokensService: AccessTokensService,
    private readonly cipherService: CipherService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + SessionsController.name,
    });
  }

  @Version(API.V1.META.version)
  @Post(API.V1.sessions.create.META.name)
  async createV1(
    @Headers()
    headers: {
      _did?: string;
      _rts?: string | any;
    },
    @Body() body: SessionCreationBody,
  ) {
    try {
      this.logger.debug({
        message: "Entering createV1 route " + SessionsController.name,
        headers: headers,
        body: body,
      });

      const { _did, _rts, ...metadata } = headers;

      // checking device
      if (!_did) {
        const device = await this.devicesService.createV1({
          metadata: metadata,
        });
        headers._did = device._id;
      }

      // checking refresh tokens
      if (!_rts) {
        headers._rts = {};
      } else {
        // fetch device data
        const device = await this.devicesService.findDeviceById(headers._did);

        // compate the refresh tokens
        if (device.tokens !== _rts) {
          throw new InternalServerErrorException(
            "Refresh tokens do not match!",
          );
        }

        // decrypt refresh token object
        const decryptedRefreshTokenObject =
          this.cipherService.decryptObject(_rts);

        headers._rts = decryptedRefreshTokenObject;
      }

      // create refresh token
      const refreshToken = await this.refreshTokensService.create({
        sub: body.user_id,
        jti: headers._did,
      });

      // create session of refresh token
      const session = await this.sessionsService.createV1({
        metadata: metadata,
        token: refreshToken,
        user_id: body.user_id,
        device_id: headers._did,
      });

      // encrypt refresh token object
      const encryptedRefreshTokenObject = this.cipherService.encryptObject({
        ...headers._rts,
        [session.user_id]: refreshToken,
      });

      // add encrypted refresh token object to headers
      headers._rts = encryptedRefreshTokenObject;

      // save refresh token in device
      await this.devicesService.updateTokensV1(
        headers._did,
        encryptedRefreshTokenObject,
      );

      // create access token
      const accessToken = await this.accessTokensService.create({
        sub: session.user_id,
        jti: session._id,
      });

      await this.sessionsService.updateLastUsedTimeV1(accessToken);

      return {
        accessToken: accessToken,
        headers: headers,
        body: body,
      };
    } catch (err) {
      this.logger.error({
        message: "Error in createV1 route " + SessionsController.name,
        error: err,
      });
      return err.response;
    }
  }

  @Version(API.V1.META.version)
  @Get(API.V1.sessions.verify.META.name)
  async verifyV1(
    @Headers() headers: any,
    @Body() body: SessionVerificationBody,
  ) {
    try {
      this.logger.debug({
        message: "Entering verifyV1 route " + SessionsController.name,
        headers: headers,
        body: body,
      });

      const { _did, _rts, authorization } = headers;

      // checking device
      if (
        !_did ||
        !_rts ||
        !authorization ||
        !authorization.startsWith("Bearer ")
      ) {
        throw new NotFoundException("Device or tokens not found!");
      }

      const decodedAccessToken = await this.accessTokensService.decode(
        authorization.slice(7),
      );

      const accessTokenCompromised =
        this.accessTokensService.compromise(decodedAccessToken);

      if (accessTokenCompromised) {
        // logout user or create a new access token
        throw new InternalServerErrorException("Access token compromised!");
      }

      const accessTokenExpired =
        this.accessTokensService.expiry(decodedAccessToken);

      const deviceWithSession =
        await this.sessionsService.findSessionByIdWithDevice(
          decodedAccessToken.jti,
        );

      // decrypt refresh token object
      const decryptedRefreshTokenObject =
        this.cipherService.decryptObject(_rts);
      const currentUserToken =
        decryptedRefreshTokenObject[deviceWithSession.sessions.user_id];

      if (
        !deviceWithSession ||
        deviceWithSession.devices.tokens !== headers._rts ||
        currentUserToken !== deviceWithSession.sessions.token ||
        deviceWithSession.sessions.status !== SESSION_STATUS.ACTIVE
      ) {
        // logout user
        throw new NotFoundException("Device not found!");
      }

      const decodedRefreshToken =
        await this.refreshTokensService.decode(currentUserToken);

      const refreshTokenCompromised =
        this.refreshTokensService.compromise(decodedRefreshToken);

      if (decodedRefreshToken.sub === decodedAccessToken.sub) {
        // TODO: if sub(user) id are same the ncheck user status like active or not
      }

      if (refreshTokenCompromised) {
        // logout user or create a new refresh token
        throw new InternalServerErrorException("Refresh token compromised!");
      }

      const refreshTokenExpired =
        this.refreshTokensService.expiry(decodedRefreshToken);

      if (refreshTokenExpired) {
        // create new refresh token
        return await this.createV1(headers, {
          ...body,
          user_id: deviceWithSession.sessions.user_id,
        });
      } else if (accessTokenExpired) {
        const accessToken = await this.accessTokensService.create({
          sub: deviceWithSession.sessions.user_id,
          jti: deviceWithSession.sessions._id,
        });

        await this.sessionsService.updateLastUsedTimeV1(accessToken);

        return {
          accessToken: accessToken,
          headers: headers,
          body: body,
        };
      }

      return {
        headers: headers,
        body: body,
      };
    } catch (err) {
      this.logger.error({
        message: "Error in verifyV1 route " + SessionsController.name,
        error: err,
      });
      return err.response;
    }
  }

  @Version(API.V1.META.version)
  @Delete("delete")
  async deleteV1(
    @Headers()
    headers: {
      _did?: string;
      _rts?: string | any;
      authorization: string;
    },
    @Body() body: any,
  ) {
    try {
      this.logger.debug({
        message: "Entering deleteV1 route " + SessionsController.name,
        headers: headers,
        body: body,
      });

      const { _did, _rts, authorization } = headers;

      // checking device
      if (
        !_did ||
        !_rts ||
        !authorization ||
        !authorization.startsWith("Bearer ")
      ) {
        throw new NotFoundException("Device or refresh tokens not found!");
      }

      const decodedAccessToken = await this.accessTokensService.decode(
        authorization.slice(7),
      );

      const accessTokenCompromised =
        this.accessTokensService.compromise(decodedAccessToken);

      if (accessTokenCompromised) {
        // logout user or create a new access token
        throw new InternalServerErrorException("Access token compromised!");
      }

      const deviceWithSession =
        await this.sessionsService.findSessionByIdWithDevice(
          decodedAccessToken.jti,
        );

      // decrypt refresh token object
      const decryptedRefreshTokenObject =
        this.cipherService.decryptObject(_rts);
      const currentUserToken =
        decryptedRefreshTokenObject[deviceWithSession.sessions.user_id];

      if (
        !deviceWithSession ||
        deviceWithSession.devices.tokens !== headers._rts ||
        currentUserToken !== deviceWithSession.sessions.token ||
        deviceWithSession.sessions.status !== SESSION_STATUS.ACTIVE
      ) {
        // logout user
        throw new NotFoundException("Device not found!");
      }

      const decodedRefreshToken =
        await this.refreshTokensService.decode(currentUserToken);

      const refreshTokenCompromised =
        this.refreshTokensService.compromise(decodedRefreshToken);

      if (decodedRefreshToken.sub === decodedAccessToken.sub) {
        // TODO: if sub(user) id are same the ncheck user status like active or not
      }

      if (refreshTokenCompromised) {
        // logout user or create a new refresh token
        throw new InternalServerErrorException("Refresh token compromised!");
      }

      await this.sessionsService.updateV1(deviceWithSession.sessions._id, {
        status: SESSION_STATUS.LOGOUT_SELF,
      });
      delete decryptedRefreshTokenObject[deviceWithSession.sessions.user_id];

      if (isEmptyObject(decryptedRefreshTokenObject)) {
        headers._rts = null;
      } else {
        // encrypt refresh token object
        const encryptedRefreshTokenObject = this.cipherService.encryptObject(
          decryptedRefreshTokenObject,
        );

        headers._rts = encryptedRefreshTokenObject;
      }

      await this.devicesService.updateV1(deviceWithSession.devices._id, {
        tokens: headers._rts,
      });

      return {
        headers: headers,
        body: body,
      };
    } catch (err) {
      this.logger.error({
        message: "Error in deleteV1 route " + SessionsController.name,
        error: err,
      });
      return err.response;
    }
  }
}
