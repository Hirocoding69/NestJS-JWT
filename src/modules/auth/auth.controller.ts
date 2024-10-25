import { Body, Controller, Post, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/user.entity';
import { LocalAuthGuard } from './guards/local-auth-gard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController { 
    constructor(private readonly authService: AuthService, private readonly userService:UsersService) {}
    @Post('register')
    async register(@Body() userDto: CreateUserDto): Promise<User> {
        return this.userService.create(userDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
  login(@Request() req, @Response() res): any {
    const cookies = req.headers.cookie?.split('; ');
  if (!cookies?.length) {
    return null;
  }
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refresh_token'));
    if (!refreshTokenCookie) {
      return null;
    }
    const refreshToken = refreshTokenCookie.split('=')[1];
    console.log('refreshToken', refreshToken);
    return this.authService.login(req.user, res);
  }
}
