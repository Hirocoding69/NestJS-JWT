import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/role.guard';
import { Roles } from 'src/common/decorators/role-decorators';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
       
    @Get()
    getAll(): Promise<Role[]> {
        return this.rolesService.getAll();
    }
    @Post()
    create(@Body() request): Promise<Role> {
        return this.rolesService.create(request);
    }
    @Post('assign')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    assignRoleToUser(@Body() request): Promise<void> {
        return this.rolesService.assignRoleToUser(request.userId, request.roleId);
    }
}
