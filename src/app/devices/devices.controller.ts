import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { DevicesService } from "@/app/devices/devices.service";
import { CreateDeviceDto } from "@/app/devices/dto/create-device.dto";
import { UpdateDeviceDto } from "@/app/devices/dto/update-device.dto";

@Controller("devices")
export class DevicesController {
  private logger: Logger = new Logger(DevicesController.name);

  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.devicesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(+id, updateDeviceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.devicesService.remove(+id);
  }
}
