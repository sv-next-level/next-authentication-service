import { EMAIL_BLACKLISTED_CHARS, PORTAL } from "@/constants";

import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  ValidationArguments,
} from "class-validator";
import { getEmailErrorMessage } from "@/dtos/functions";

export class LoginDTO {
  @IsEmail(
    {
      blacklisted_chars: EMAIL_BLACKLISTED_CHARS,
    },
    {
      message(validationArguments: ValidationArguments) {
        const error: string = getEmailErrorMessage(validationArguments);
        return error;
      },
    }
  )
  readonly email: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;

  @IsString({ message: "Password should be string only" })
  @Length(6, 64, { message: "Invalid length of password" })
  readonly password: string;
}
