import { User } from 'src/modules/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({default: false})
  revoked: boolean;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' }) 
  user: User;
}
