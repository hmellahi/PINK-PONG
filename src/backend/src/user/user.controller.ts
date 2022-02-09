import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { UserService } from "./user.service";

@Controller("users")

export class  UserController
{
    constructor(
        private userServerice: UserService
        ){}

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, "..","..", "public/users"),
            filename: (req, file, cp)=>
            {
                cp(null, file.originalname);
            }
        })
    }))

    @Post("updateAvatar")
    @HttpCode(200)
    async update(@Req() request: RequestWithUser,
                @UploadedFile() file: Express.Multer.File)
    {
        const {user} = request;
        if (file)
        {
            const avatar_url: string  = join(__dirname, "..", "..","public/users", file?.originalname);
            await this.userServerice.findByIdAndUpdate(user.id, {avatar_url})
        }
        else
            throw new BadRequestException;        
    }

    // until we agree how to update user informatio
    @UseGuards(JwtAuthGuard)
    @Get("me")
    async myProfile(@Req() request: RequestWithUser)
    {
        const {user} = request;
        return user;
    }
}
