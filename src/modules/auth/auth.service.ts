import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/modules/tokens/token.entity';
import { createHash } from 'crypto';
import { Response } from 'express';
import { ConfigType } from '@nestjs/config';
import { jwtRefreshConfig } from 'src/config/jwt-refresh.config';
import { cookieConfig } from './utils/cookies';
import { Console } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    @Inject(jwtRefreshConfig.KEY) private readonly refreshTokenConfig: ConfigType<typeof jwtRefreshConfig>
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['roles'] });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }
  async login(user: any, res: Response) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };

    const token = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenConfig.secret,
      expiresIn: this.refreshTokenConfig.expiresIn,
    });

    const tokenObj = new Token();
    tokenObj.token = createHash('sha256').update(refreshToken).digest('hex');
    tokenObj.user = user;
    await this.tokenRepository.save(tokenObj);

    const expiresIn = this.refreshTokenConfig.expiresIn;
    const maxAge = parseInt(String(expiresIn)) * 1000;
    console.log(cookieConfig(this.refreshTokenConfig).refreshToken.name);

    res.cookie(cookieConfig(this.refreshTokenConfig).refreshToken.name, {
      ...cookieConfig(this.refreshTokenConfig).refreshToken.options,
      maxAge: maxAge,
    });

    // Send access token as response
    res.send({ access_token: token });
  }
}
