import { User } from "src/modules/users/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}