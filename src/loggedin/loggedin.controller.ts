import { Body, Controller, Logger, Post } from "@nestjs/common";

import { CreateLoggedinDTO } from "@/dtos";
import { loggedinDocument } from "@/schemas";
import { LoggedinService } from "@/loggedin/loggedin.service";

@Controller("loggedins")
export class LoggedinController {
  private logger: Logger = new Logger("loggedin.controller");

  constructor(private readonly loggedinService: LoggedinService) {
    this.logger.debug({
      message: "Entering constructor of loggedin controller",
    });
  }

  @Post("create")
  async createLoggedin(
    @Body() loggedinDto: CreateLoggedinDTO
  ): Promise<loggedinDocument> {
    try {
      this.logger.debug({
        message: "Entering createLoggedin",
        user_id: loggedinDto.userId,
        portal: loggedinDto.portal,
      });

      const loggedin: loggedinDocument =
        await this.loggedinService.create(loggedinDto);

      return loggedin;
    } catch (error: any) {
      this.logger.error({
        message: "Error creating loggedin",
        user_id: loggedinDto.userId,
        portal: loggedinDto.portal,
        error: error,
      });
      return error;
    }
  }
}
