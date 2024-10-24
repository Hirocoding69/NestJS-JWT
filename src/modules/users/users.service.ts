import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    async create (request): Promise<User> {
        const {email, password, firstName, lastName} = request;
        var existingUser = await this.userRepository.findOneBy({email});
        if (existingUser) {
            throw new HttpException('User already exists', 400);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        }); 
        return this.userRepository.save(user);
    }
    async getUserWithTokens(userId: number): Promise<User> {
        return this.userRepository.findOne({
          where: { id: userId },
          relations: ['tokens'],
        });
      }

}
