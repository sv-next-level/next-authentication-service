import { and, eq, gte } from "drizzle-orm";

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DevicesService } from "@/app/devices/devices.service";
import { Device } from "@/app/devices/entities/device.drizzle.entity";
import { Session } from "@/app/sessions/entities/session.drizzle.entity";
import { AccessTokensService } from "@/app/tokens/access-tokens.service";
import { RefreshTokensService } from "@/app/tokens/refresh-tokens.service";
import { CipherService } from "@/nestjs/app/cipher/cipher.service";

import { DrizzleService } from "@/nestjs/db/postgres/drizzle/drizzle.service";

import { SESSION_STATUS } from "./entities/sessions.enum";

@Injectable()
export class SessionsService {
  private logger: Logger = new Logger(SessionsService.name);

  constructor(
    private readonly cipherService: CipherService,
    private readonly devicesService: DevicesService,
    private readonly accessTokensService: AccessTokensService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly Drizzle: DrizzleService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug({
      message: "Entering constructor of " + SessionsService.name,
    });
  }

  async createV1(createSessionDto: any) {
    try {
      this.logger.debug({
        message: "Entering createV1 of " + SessionsService.name,
        create_session_dto: createSessionDto,
      });

      const token = await this.refreshTokensService.decode(
        createSessionDto.token,
      );

      const sessions = await this.Drizzle.db
        .insert(Session)
        .values({
          ...createSessionDto,
          last_used_at: new Date(),
          expires_at: new Date(token.exp * 1000),
        })
        .returning();

      if (sessions.length > 1) {
        throw new NotFoundException("Multiple sessions found!");
      }

      return sessions[0];
    } catch (err) {
      console.log("🚀 ~ SessionsService ~ createV1 ~ err:", err);
      this.logger.error({
        message: "Error in createV1 of " + SessionsService.name,
        error: err.message,
      });
      throw err;
    }
  }

  async findSessionByIdWithDevice(id: string) {
    try {
      this.logger.debug({
        message:
          "Entering findSessionByIdWithDevice of " + SessionsService.name,
        id: id,
      });

      const deviceWithSession = await this.Drizzle.db
        .select()
        .from(Session)
        .fullJoin(Device, eq(Device._id, Session.device_id))
        .where(
          and(
            eq(Session._id, id),
            eq(Session.status, SESSION_STATUS.ACTIVE),
            gte(Session.expires_at, new Date()),
          ),
        );

      if (deviceWithSession.length !== 1) {
        throw new NotFoundException("Multiple or no devices found!");
      }

      return deviceWithSession[0];
    } catch (error) {
      this.logger.error({
        message:
          "Error in findSessionByIdWithDevice of " + SessionsService.name,
        error: error.message,
      });
      throw error;
    }
  }

  async updateLastUsedTimeV1(token: string) {
    try {
      this.logger.debug({
        message: "Entering updateLastUsedTimeV1 of " + SessionsService.name,
        token: token,
      });

      const tokenData = await this.accessTokensService.decode(token);

      const sessions = await this.Drizzle.db
        .update(Session)
        .set({
          last_used_at: new Date(tokenData.iat * 1000),
        })
        .where(eq(Session._id, tokenData.jti))
        .returning();

      if (sessions.length !== 1) {
        throw new NotFoundException("Multiple or no sessions found!");
      }

      return sessions[0];
    } catch (err) {
      console.log("🚀 ~ SessionsService ~ updateLastUsedTimeV1 ~ err:", err);
      this.logger.error({
        message: "Error in updateLastUsedTimeV1 of " + SessionsService.name,
        error: err.message,
      });
      throw err;
    }
  }

  async updateV1(id: string, updateSessionDto: any) {
    try {
      this.logger.debug({
        message: "Entering updateV1 of " + SessionsService.name,
        id: id,
      });

      const sessions = await this.Drizzle.db
        .update(Session)
        .set(updateSessionDto)
        .where(eq(Session._id, id))
        .returning();

      if (sessions.length !== 1) {
        throw new NotFoundException("Multiple or no sessions found!");
      }

      return sessions[0];
    } catch (err) {
      console.log("🚀 ~ SessionsService ~ updateV1 ~ err:", err);
      this.logger.error({
        message: "Error in updateV1 of " + SessionsService.name,
        error: err.message,
      });
      throw err;
    }
  }
}
