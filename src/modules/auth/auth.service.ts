import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/modules/tokens/token-blacklist.entity';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email }, relations: ['roles'] });
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        throw new UnauthorizedException();
      }
      async login(user: any) {
        console.log(user);
        
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        
        const token = this.jwtService.sign(payload);
        
        const tokenObj = new Token();
        
        tokenObj.token = createHash('sha256').update(token).digest('hex');
        
        tokenObj.user = user;
        
        await this.tokenRepository.save(tokenObj);
        
        return {
            id: user.id,
            email: user.email,
            access_token: token,
        };
    }
    }
