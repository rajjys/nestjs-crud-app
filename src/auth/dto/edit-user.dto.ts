import { IsEmail, IsOptional, isString, IsString } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;
    
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}