import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto
{
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    password: string;

    login?: string; 

    @IsEmail()
    email: string;
}