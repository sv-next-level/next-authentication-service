import { PartialType } from "@nestjs/mapped-types";

import { CreateSessionDto } from "@/app/sessions/dto/create-session.dto";

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
