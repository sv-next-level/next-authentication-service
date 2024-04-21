import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

import { PORTAL } from "@/constants";

export class CreateTokenDTO {
  @IsMongoId()
  readonly userId: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;
}

export class AccessTokenDTO {
  @IsMongoId()
  readonly userId: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;
}

export class RefreshTokenDTO {
  @IsMongoId()
  readonly userId: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;
}

export class TokensDTO {
  @IsNotEmpty({ message: "access token can't be empty" })
  @IsString({ message: "access token should be string only" })
  readonly access: string;

  @IsNotEmpty({ message: "refresh token can't be empty" })
  @IsString({ message: "refresh token should be string only" })
  readonly refresh: string;
}

export class HashedTokenDTO {
  @IsMongoId()
  readonly userId: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;

  @ValidateNested()
  readonly tokens: TokensDTO;
}

// const tokenDto = {
//   userId: "fsfd",
//   portal: : "DASHBOARD"
//   tokens: {
//     access: "fdsfds",
//     refresh: "fdsfds",
//   },
// };
