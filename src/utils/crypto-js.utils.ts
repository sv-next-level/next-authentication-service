import { AES, enc } from "crypto-js";
import { ConfigService } from "@nestjs/config";

const configService: ConfigService = new ConfigService();
const SECRET_KEY: string = configService.get<string>("CIPHER_SECRET_KEY");

export const encryptString = (text: string): string => {
  return AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptString = (text: string): string => {
  return AES.decrypt(text, SECRET_KEY).toString(enc.Utf8);
};

export const encryptObject = (data: any): string => {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptObject = (data: string): any => {
  return JSON.parse(AES.decrypt(data, SECRET_KEY).toString(enc.Utf8));
};
