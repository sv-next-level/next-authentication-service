export const TIME_CONFIG = () => {
  return {
    JWT_ACCESS_EXPIRES_IN: process.env["JWT_ACCESS_EXPIRES_IN"],
    JWT_REFRESH_EXPIRES_IN: process.env["JWT_REFRESH_EXPIRES_IN"],
  };
};
