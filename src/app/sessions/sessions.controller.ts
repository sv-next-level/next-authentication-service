import { Controller, Get, Logger, Version } from "@nestjs/common";

import { SessionsService } from "@/app/sessions/sessions.service";

@Controller("sessions")
export class SessionsController {
  private logger: Logger = new Logger(SessionsController.name);

  constructor(private readonly sessionsService: SessionsService) {
    this.logger.debug({
      message: "Entering constructor of " + SessionsController.name,
    });
  }

  @Version("1")
  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }
}
