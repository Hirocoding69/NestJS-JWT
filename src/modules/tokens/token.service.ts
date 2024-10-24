import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Token } from './token-blacklist.entity';
import { User } from 'src/modules/users/user.entity';
import { createHash } from 'crypto';

@Injectable()
export class TokenService {
    constructor(private entityManager: EntityManager) { }
    async revokeToken(token: string, userId: number) {
        const userObj = await this.entityManager.findOne(User, { where: { id: userId } });
        const hashedToken = createHash('sha256').update(token).digest('hex');
        const result = await this.entityManager.findOne(Token, {
            where: {
                user: userObj,
                token: hashedToken,
                revoked: false,
            },
        });
        if (!result) {
            return;
        }
        result.revoked = true;
        await this.entityManager.save(result);


    }
    async revokeAllTokens(userId: number) {
        const userObj = await this.entityManager.findOne(User, { where: { id: userId } });
        if (!userObj) {
            console.error(`User with ID ${userId} not found.`);
            return;
        }
        //Either set all tokens to revoked or delete them
        const result = await this.entityManager.update(Token,
            { user: userObj, revoked: false },
            { revoked: true }
        );

        console.log(`${result.affected} tokens revoked for user ID ${userId}.`);
    }

}
