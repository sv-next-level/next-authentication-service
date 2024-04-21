import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { AES, enc } from "crypto-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CipherService {
  private logger: Logger = new Logger("cipher.service");
  private secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.logger.debug({
      message: "Entering constructor of cipher service",
    });

    this.secretKey = this.configService.get<string>("CIPHER_SECRET_KEY");
  }

  encryptString(data: string): string {
    try {
      const cipherText: string = AES.encrypt(data, this.secretKey).toString();

      if (!cipherText) {
        this.logger.warn({
          message: "Failed to encrypt string",
          data_length: data.length,
        });
        throw new InternalServerErrorException(
          "Failed to encrypt string"
        ).getResponse();
      }

      return cipherText;
    } catch (error) {
      this.logger.error({
        message: "Error encrypting string",
        data_length: data.length,
        error: error,
      });
      throw error;
    }
  }

  decryptString(data: string): string {
    try {
      const cipherText: string = AES.decrypt(data, this.secretKey).toString();

      if (!cipherText) {
        this.logger.warn({
          message: "Failed to decrypt string",
          data_length: data.length,
        });
        throw new InternalServerErrorException(
          "Failed to decrypt string"
        ).getResponse();
      }

      return cipherText;
    } catch (error) {
      this.logger.error({
        message: "Error decrypting string",
        data_length: data.length,
        error: error,
      });
      throw error;
    }
  }

  encryptObject(data: any): string {
    try {
      const cipherText: string = AES.encrypt(
        JSON.stringify(data),
        this.secretKey
      ).toString();

      if (!cipherText) {
        this.logger.warn({
          message: "Failed to encrypt object",
          data_length: JSON.stringify(data).length,
        });
        throw new InternalServerErrorException(
          "Failed to encrypt object"
        ).getResponse();
      }

      return cipherText;
    } catch (error) {
      this.logger.error({
        message: "Error encrypting object",
        data_length: JSON.stringify(data).length,
        error: error,
      });
      throw error;
    }
  }

  decryptObject(data: string): any {
    try {
      const cipherObject: any = JSON.parse(
        AES.decrypt(data, this.secretKey).toString(enc.Utf8)
      );

      if (!cipherObject) {
        this.logger.warn({
          message: "Failed to decrypt object",
          data_length: data.length,
        });
        throw new InternalServerErrorException(
          "Failed to decrypt object"
        ).getResponse();
      }

      return cipherObject;
    } catch (error) {
      this.logger.error({
        message: "Error decrypting object",
        data_length: data.length,
        error: error,
      });
      throw error;
    }
  }
}
