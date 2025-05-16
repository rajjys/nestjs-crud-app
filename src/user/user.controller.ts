import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/';
import { EditUserDto } from 'src/auth/dto';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService:UserService){}

    @Get('me')
    getMe(@GetUser() user: User){
        //remove the hash
        const {hash, ...userWithoutHash} = user;
        return userWithoutHash;
    }

    @Patch()
    editUser( @GetUser('id') userId: number, @Body() dto: EditUserDto){
        ///update user
        return this.userService.editUser(userId, dto);
    }
}
