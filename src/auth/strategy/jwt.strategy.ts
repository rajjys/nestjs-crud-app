import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    async validate( payload: {sub: number, email: string}) {
        
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        })
        
        return user;
    }
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || "default_secret", // Provide a fallback or handle undefined
        });
    }

    
}