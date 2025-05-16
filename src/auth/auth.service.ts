import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import { hash, verify } from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService){}
    async signin(dto: AuthDto) {
        ///find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }});
        ///if user not found throw exception
            if(!user){
                throw new ForbiddenException("Credentials incorrect");
            }
        ///compare password
        const passwordMatch = user && await verify(user.hash, dto.password);
        ///if password not match throw exception
            if(!passwordMatch){
                throw new ForbiddenException("Credentials incorrect");
            }
            ///return jwt token
        return this.signToken(user.id, user.email);
    }

    async signup(dto: AuthDto){
        ///Geerate password hash
        const hashedPassword = await hash(dto.password);
       try {
         ///save user in db
         const user = await this.prisma.user.create({
            data: {
            email: dto.email,
            firstName: dto.firstname,
            lastName: dto.lastname,
            hash: hashedPassword,
        }  
          } );

          ///delete password hash from user object
          const { hash, ...userWithoutHash } = user;
         ///send back user
             return userWithoutHash;

        } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === "P2002"){
                throw new ForbiddenException("Credentials taken");
            }
        }
       }
    }

    async signToken(userId: number, email: string) : Promise<{ access_token: string }> {
        ///sign the token with userId and email
        const payload = {
            sub: userId,
            email
        }
        const token = await this.jwt.signAsync(payload, {
                            expiresIn: "15m",
                            secret: process.env.JWT_SECRET,
                        });
        return {
            access_token: token,
        };
    }
}
