import { IsEmail, IsNotEmpty, isPhoneNumber } from "class-validator";

export class CreateUserDto
{
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    password?: string;

    @IsNotEmpty()
    login?: string; 

    @IsEmail()
    email: string;
}