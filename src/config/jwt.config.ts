import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string | number>('JWT_EXPIRATION_TIME') || '3600s',
  },
});

export const JwtConfigModule = {
  imports: [ConfigService],
  inject: [ConfigService],
  useFactory: getJwtConfig,
};
