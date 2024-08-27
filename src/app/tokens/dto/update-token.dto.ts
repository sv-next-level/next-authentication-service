import { PartialType } from "@nestjs/mapped-types";

import { CreateTokenDto } from "@/app/tokens/dto/create-token.dto";

export class UpdateTokenDto extends PartialType(CreateTokenDto) {}
