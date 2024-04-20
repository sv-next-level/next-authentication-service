import { Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { PORTAL, LOGGEDIN_STATUS } from "@/constants";
import { decryptString, encryptString } from "@/utils";

@Schema({
  timestamps: true,
  methods: {
    encryptRefreshToken(this: any): void {
      const encryptedRefreshToken: string = encryptString(this.refresh_token);
      this.refresh_token = encryptedRefreshToken;
    },
    decryptRefreshToken(this: any): void {
      const decryptedRefreshToken: string = decryptString(this.refresh_token);
      this.refresh_token = decryptedRefreshToken;
    },
  },
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
    unique: true,
    required: true,
  })
  refresh_token: string;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  last_used: Date;

  @Prop({
    type: Object,
    required: true,
  })
  device_info: object;

  @Prop({
    type: String,
    enum: LOGGEDIN_STATUS,
    default: LOGGEDIN_STATUS.ACTIVE,
  })
  status: LOGGEDIN_STATUS;
}

export const loggedinSchema = SchemaFactory.createForClass(Loggedin);

export type loggedinDocument = Loggedin & Document & { _id: string };

export const LOGGEDIN_MODEL = Loggedin.name;

loggedinSchema.pre("save", function (next: () => void) {
  const hashedRefreshToken: string = encryptString(this.refresh_token);
  this.refresh_token = hashedRefreshToken;
  next();
});
