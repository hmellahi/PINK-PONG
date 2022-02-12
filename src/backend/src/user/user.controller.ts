import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { UserService } from "./user.service";
import { editFileName, imageFileFilter } from "./utils/user.utils";

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
            const avatar_url: string  = this.configService.get("BACKEND_URL") + `/public/users/${file.filename}`;

            await this.userService.findByIdAndUpdate(user.id, {avatar_url})
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

        if (!login)
            throw new HttpException("login not provided", HttpStatus.BAD_REQUEST);
        if (await this.userService.getByLogin(login))
            throw new HttpException("login already exist", HttpStatus.BAD_REQUEST);

        await this.userService.findByIdAndUpdate(user.id, {login: login});
    }

    // until we agree how to update user informatio
    @Get("me")
    async myProfile(@Req() request: RequestWithUser)
    {
        const {user} = request;
        return user;
    }

    @Get(":login")
    async getUserByLogin(@Param("login") login: string)
    {
        if (!login)
            throw new BadRequestException;
        const user = await this.userService.getByLogin(login);
        if (!user)
            throw new HttpException("user not exist", HttpStatus.NOT_FOUND);
        return user;
    }
}
