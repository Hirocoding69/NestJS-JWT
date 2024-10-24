import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Role } from './roles.entity';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(User)
        private usersRepository: Repository<User>

    ){}

    async create(request): Promise<Role> {
        const newRole = new Role();
        newRole.name = request.name;
        return this.rolesRepository.save(newRole);
    }
    async getAll(): Promise<Role[]> {
        return this.rolesRepository.find();
    }
    async getOne(id: number): Promise<Role> {
        return this.rolesRepository.findOneBy({id: id});
    }
    async update(id: number, request): Promise<Role> {
        const role = await this.rolesRepository.findOneBy({id: id});
        role.name = request.name;
        return this.rolesRepository.save(role);
    }
    async delete(id: number): Promise<void> {
        await this.rolesRepository.delete(id);
    }
    async assignRoleToUser(userId: number, roleId: number): Promise<void> {
        await this.usersRepository.manager.transaction(async (entityManager: EntityManager) => {
            const user = await entityManager.findOne(User, { where: { id: userId }, relations: ['roles'] });
            const role = await entityManager.findOne(Role, { where: { id: roleId } });
    
            if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
            if (!role) throw new NotFoundException(`Role with ID ${roleId} not found`);
    
            if (!user.roles) {
                user.roles = [];
            }
    
            if (!user.roles.find(r => r.id === role.id)) {
                user.roles.push(role);
            }
    
            await entityManager.save(User, user);
        });
    }

}
