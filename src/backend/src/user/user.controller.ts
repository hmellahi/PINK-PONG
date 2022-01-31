import { Body, Controller, Get, HttpCode, HttpException, Post } from "@nestjs/common";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UserService } from "./user.service";

@Controller("user")

export class  UserController
{
    constructor(private userServerice: UserService){}
    
}
