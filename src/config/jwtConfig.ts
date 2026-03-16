import 'dotenv/config';

export const jwtConfig = {
  accessToken: process.env.ACCESS_TOKEN_LIFE,
  refreshToken: process.env.REFRESH_TOKEN_LIFE,
};
