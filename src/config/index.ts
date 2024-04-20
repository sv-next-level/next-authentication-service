export * from "@/config/env.validation";
import { ENV_CONFIG } from "@/config/env.config";
import { SECRET_CONFIG } from "@/config/secret.config";
import { AUTH_SERVICE_DB_CONFIG } from "@/config/database.config";

export default [ENV_CONFIG, SECRET_CONFIG, AUTH_SERVICE_DB_CONFIG];