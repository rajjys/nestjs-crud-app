import { Injectable } from '@nestjs/common';
import { EditUserDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}
    async editUser(userID: number, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userID
            },
            data: {
                ...dto
            }
        });
        const {hash, ...userWithoutHash } = user;
        return userWithoutHash;
}
}
