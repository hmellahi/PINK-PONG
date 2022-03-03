import { IsEmail, IsNotEmpty, isPhoneNumber } from "class-validator";

export class CreateUserDto
{
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    login?: string; 

    @IsEmail()
    email: string;

    // @IsNotEmpty()
    avatar_url?: string;
}