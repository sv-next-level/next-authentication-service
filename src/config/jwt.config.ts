export const JWT_CONFIG = () => {
  return {
    JWT_ACCESS_EXPIRES_IN: process.env["JWT_ACCESS_EXPIRES_IN"],
    JWT_ACCESS_SECRET_KEY: process.env["JWT_ACCESS_SECRET_KEY"],
    JWT_REFRESH_EXPIRES_IN: process.env["JWT_REFRESH_EXPIRES_IN"],
    JWT_REFRESH_SECRET_KEY: process.env["JWT_REFRESH_SECRET_KEY"],
  };
};
