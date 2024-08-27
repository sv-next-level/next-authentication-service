import { Module } from "@nestjs/common";

import { DevicesController } from "@/app/devices/devices.controller";
import { DevicesService } from "@/app/devices/devices.service";

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
