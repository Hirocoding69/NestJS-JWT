import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export const jwtRefreshConfig = registerAs('jwtRefresh', (): JwtSignOptions => ({
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
}));
