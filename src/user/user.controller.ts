import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
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
        return user;
    }

    @Patch()
    editUser( @GetUser('id') userId: number, @Body() dto: EditUserDto){
        ///update user
        return this.userService.editUser(userId, dto);
    }
}
