import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // Adjust the path as necessary
import { AuthService } from './auth.service'; // Import your AuthService
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../tokens/token-blacklist.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get<string>('JWT_EXPIRATION_TIME')}s` },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
