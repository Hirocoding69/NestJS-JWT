import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { Request } from 'express';

// Function to create cookie configuration based on JWT refresh config
export const cookieConfig = (jwtConfig?: JwtSignOptions) => ({
  refreshToken: {
    name: 'refreshToken',
    options: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict' as 'strict',
      secure: true,
      maxAge: parseInt(String(jwtConfig.expiresIn)) * 1000, // Set maxAge based on JWT expiration time
    },
  },
});

// Extract refresh token from cookies
export const extractRefreshTokenFromCookies = (req: Request) => {
  const cookies = req.headers.cookie?.split('; ');
  if (!cookies?.length) {
    return null;
  }

  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${cookieConfig().refreshToken.name}=`)
  );

  if (!refreshTokenCookie) {
    return null;
  }

  return refreshTokenCookie.split('=')[1] as string;
};
