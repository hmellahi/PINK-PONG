import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class UserAuthDataDto
{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}