  import { Module } from '@nestjs/common';
  import { RolesService } from './roles.service';
  import { RolesController } from './roles.controller';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { Role } from './roles.entity';
  import { User } from 'src/modules/users/user.entity';

  @Module({
    imports: [
      TypeOrmModule.forFeature([Role, User]),
    ],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService],
  })
  export class RolesModule {}
