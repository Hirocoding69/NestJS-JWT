import { Exclude } from 'class-transformer';
import { Role } from 'src/modules/roles/roles.entity';
import { Token } from 'src/modules/tokens/token-blacklist.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @ManyToMany(() => User, (user) => user.following)
    followers: User[];

    @ManyToMany(() => User, (user) => user.followers)
    following: User[];


    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable(
        {
            name: 'users_roles',
            joinColumn: { name: 'user_id', referencedColumnName: 'id' },
            inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
        }
    )
    roles: Role[];
    
    @OneToMany(() => Token, (tokenBlacklist) => tokenBlacklist.user)
    tokens: Token[];

}
