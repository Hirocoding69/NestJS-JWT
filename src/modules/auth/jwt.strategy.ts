import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm'; 
import { Token } from 'src/modules/tokens/token-blacklist.entity';
import { Request } from 'express';
import { User } from 'src/modules/users/user.entity';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.replace('Bearer ', '');
    const isValid = await this.isTokenValid(token, payload.sub);
    if (!isValid) {
      throw new UnauthorizedException('Token is revoked');
    }

    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }

  async isTokenValid(token: string, userId: number): Promise<boolean> {
    const userObj = await this.entityManager.findOne(User, { where: { id: userId } });
    if (!userObj) {
        console.error('User not found');
        return false; 
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const tokenExists = await this.entityManager.findOne(Token, {
        where: {
            user: userObj,
            token: hashedToken,
            revoked: false,
        },
    });

    if (tokenExists) {
        return true;
    }

    return false;
}

}
