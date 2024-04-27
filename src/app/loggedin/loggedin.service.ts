import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { CreateLoggedinDTO } from "@/dtos";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { LOGGEDIN_MODEL, loggedinDocument } from "@/schemas";

@Injectable()
export class LoggedinService {
  private logger: Logger = new Logger("loggedin.service");

  constructor(
    @InjectModel(LOGGEDIN_MODEL, DATABASE_CONNECTION_NAME.AUTH_SERVICE_DB)
    private readonly loggedinModel: Model<loggedinDocument>
  ) {
    this.logger.debug({
      message: "Entering constructor of loggedin service",
    });
  }

  async create(loggedinDto: CreateLoggedinDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering create",
        user_id: loggedinDto.userId,
        portal: loggedinDto.portal,
      });

      const newloggedin: loggedinDocument = await this.loggedinModel.create({
        user_id: loggedinDto.userId,
        portal: loggedinDto.portal,
        device_info: loggedinDto.deviceInfo,
        refresh_token: loggedinDto.refreshToken,
      });

      if (!newloggedin) {
        this.logger.warn({
          message: "Failed create new loggedin",
          user_id: loggedinDto.userId,
          portal: loggedinDto.portal,
        });
        throw new InternalServerErrorException(
          "Failed create new loggedin"
        ).getResponse();
      }

      this.logger.log({
        message: "loggedin created successfully",
        password_id: newloggedin._id,
      });

      return newloggedin._id;
    } catch (error) {
      this.logger.error({
        message: "Error creating loggedin",
        user_id: loggedinDto.userId,
        portal: loggedinDto.portal,
        error: error,
      });
      throw error;
    }
  }
}