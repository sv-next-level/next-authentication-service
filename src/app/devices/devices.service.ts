import { Injectable, Logger } from "@nestjs/common";

import { CreateDeviceDto } from "@/app/devices/dto/create-device.dto";
import { UpdateDeviceDto } from "@/app/devices/dto/update-device.dto";

@Injectable()
export class DevicesService {
  private logger: Logger = new Logger(DevicesService.name);

  create(createDeviceDto: CreateDeviceDto) {
    return "This action adds a new device";
  }

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
