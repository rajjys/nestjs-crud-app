import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
    @Post("signup")
    signup(@Body() dto: AuthDto){
       return this.authService.signup(dto);
    }
 @HttpCode(HttpStatus.OK)
    @Post("signin")
    signIn(@Body() dto: AuthDto){
        ///find user by email
        return this.authService.signin(dto);
    }
   
    @Post("login")
    login(){
        return this.authService.login();
    }
}