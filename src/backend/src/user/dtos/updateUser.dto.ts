import { IsEmail, IsNotEmpty, isPhoneNumber } from "class-validator";

export class UpdateUserDto
{

    // @IsNotEmpty()
    login?: string;

    // @IsNotEmpty()
    avatar_url?: string;
}