import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
    @Post("signup")
    signup(@Body() dto: AuthDto){
        console.log(dto);
       return this.authService.signup(dto);
    }
 @HttpCode(HttpStatus.OK)
    @Post("signin")
    signIn(@Body() dto: AuthDto){
        ///find user by email
        return this.authService.signin(dto);
    }
}