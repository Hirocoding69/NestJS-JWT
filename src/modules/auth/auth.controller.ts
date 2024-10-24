import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/user.entity';
import { LocalAuthGuard } from './local-auth-gard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService:UsersService) {}
    @Post('register')
    async register(@Body() userDto: CreateUserDto): Promise<User> {
        return this.userService.create(userDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
     login(@Request() req): any{
        return this.authService.login(req.user);
    }
}
