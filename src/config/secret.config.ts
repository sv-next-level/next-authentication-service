export const SECRET_CONFIG = () => {
  return {
    CIPHER_SECRET_KEY: process.env["CIPHER_SECRET_KEY"],
    JWT_ACCESS_SECRET_KEY: process.env["JWT_ACCESS_SECRET_KEY"],
    JWT_REFRESH_SECRET_KEY: process.env["JWT_REFRESH_SECRET_KEY"],
  };
};
