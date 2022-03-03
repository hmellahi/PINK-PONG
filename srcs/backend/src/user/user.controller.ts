import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { plainToClass } from "class-transformer";
import { request } from "express";
import { diskStorage } from "multer";
import { join } from "path";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import User from "./entities/user.entity";
import { UserService } from "./user.service";
import { editFileName, filteredUser , imageFileFilter } from "./utils/user.utils";


@UseGuards(JwtAuthGuard)
@Controller("users")
export class  UserController
{
    constructor(
        private userService: UserService,
        private configService: ConfigService
        ){}

    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: join(__dirname, "..","..", "public/users"),
            filename: editFileName
        }),
        fileFilter: imageFileFilter 
    }))

    @Post("updateAvatar")
    @HttpCode(200)
    async update(@Req() request: RequestWithUser,
                @UploadedFile() file: Express.Multer.File)
    {
        const {user} = request;
        if (file)
        {
            const image_url: string  = this.configService.get("BACKEND_URL") + `/public/users/${file.filename}`;

            await this.userService.findByIdAndUpdate(user.id, {image_url})
            const response = {
                originalname: file.originalname,
                filename: file.filename,
            };
            return response;
        }
        else
            throw new BadRequestException;        
    }

    @Post("updateLogin")
    @HttpCode(200)
    async updateLogin(@Req() request: RequestWithUser,
                        @Body("login") login: string)
    {
        const {user} = request;

        if (!login || login.length > 10)
            throw new HttpException("login not valide", HttpStatus.BAD_REQUEST);
        if (await this.userService.getByLogin(user,login))
            throw new HttpException("login already exist", HttpStatus.BAD_REQUEST);

        await this.userService.findByIdAndUpdate(user.id, {login: login});
    }

    // until we agree how to update user informatio
    @Get("me")
    async myProfile(@Req() request: RequestWithUser)
    {
        const {user} = request;
        return filteredUser (user) ;
    }

    @Get("profile/:login")
    async getUserByLogin(@Req() request: RequestWithUser,@Param("login") login: string)
    {
        const {user} = request;
        if (!login)
            throw new BadRequestException;
        const fetchedUser = await this.userService.getByLogin(user,login);
        if (!fetchedUser)
            throw new HttpException("user not exist", HttpStatus.NOT_FOUND);
        return filteredUser (fetchedUser);
    }

    @Get("")
    async getUserById(@Query("id") id: number)
    {
        if (!id || isNaN(Number(id)))
            throw new BadRequestException;
        const user = await this.userService.getById(id);
        return filteredUser (user); ;
    }

    @Post("blockUser")
    @HttpCode(200)
    async blockUser(@Req() request: RequestWithUser, @Body("userId") userId: number)
    {
        if (!userId || isNaN(Number(userId)))
            throw new BadRequestException;
        const {user} = request;
        if (!await this.userService.blockUser(user,userId))
            throw new HttpException("user not exist or already blocked", HttpStatus.BAD_REQUEST);
    }


    @Post("unblockUser")
    @HttpCode(200)
    async unblockUser(@Req() request: RequestWithUser, @Body("blockId") blockId: number)
    {
        if (!blockId || isNaN(Number(blockId)))
            throw new BadRequestException;

        const {user} = request;
        if (!await this.userService.unblockUser(user,blockId))
            throw new HttpException("blockedList not exist", HttpStatus.BAD_REQUEST);
    }

    @Get("blockedList")
    async blockedList(@Req() request: RequestWithUser)
    {
        const {user} = request;

        return await this.userService.getBlockedList(user);
    }

    @Get("usersByGames")
    async userByGames()
    {
        return await this.userService.getUsersByGames();
    }
}
