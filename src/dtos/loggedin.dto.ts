import { PORTAL } from "@/constants";

import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from "class-validator";

export class CreateLoggedinDTO {
  @IsMongoId()
  readonly userId: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;

  @IsNotEmpty({ message: "refreshToken can't be empty" })
  @IsString({ message: "refreshToken should be string only" })
  readonly refreshToken: string;

  @IsNotEmptyObject(
    { nullable: false },
    { message: "deviceInfo can't be empty" }
  )
  @IsObject({ message: "deviceInfo should be object only" })
  readonly deviceInfo: object;
}
