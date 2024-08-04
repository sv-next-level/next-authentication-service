import { Types } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { PORTAL } from "@/common/server/portal";

import { LOGGEDIN_STATUS } from "@/constants";

@Schema({
  timestamps: true,
})
export class Loggedin {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({ type: String, enum: PORTAL, required: true })
  portal: PORTAL;

  @Prop({
    type: String,
    required: true,
  })
  refresh_token: string;

  @Prop({
    type: Date,
    default: null,
    required: true,
  })
  last_used: Date;

  @Prop({
    type: Object,
    required: true,
  })
  device_info: object;

  @Prop({
    type: String,
    required: true,
    enum: LOGGEDIN_STATUS,
    default: LOGGEDIN_STATUS.ACTIVE,
  })
  status: LOGGEDIN_STATUS;
}

export const LOGGEDIN_SCHEMA_NAME = Loggedin.name;

export const LoggedinSchema = SchemaFactory.createForClass(Loggedin);

export type LoggedinDocument = Loggedin & Document & { _id: string };
