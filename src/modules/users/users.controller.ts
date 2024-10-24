import { Controller, Get, UseGuards } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request }from '@nestjs/common';
@Controller('users')
export class UsersController {
    constructor(private readonly entityManager: EntityManager) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll(@Request() req) {
        console.log(req.user);
        return this.entityManager.find(User, { relations: ['roles'] });
    }
}
