import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { UserService } from "src/user/user.service";
import { FindOneOptions } from "typeorm";
import { FriendshipService } from "./friendship.service";

@Controller("friendship")

export class FriendshipController
{
    constructor(
        private friendshipService: FriendshipService,
        private userService: UserService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get("")

    @UseGuards(JwtAuthGuard)
    @Post("sendFriendRequest")
    @HttpCode(200)
    async sendFriendRequest(@Req() request: RequestWithUser,@Body("recieverLogin") recieverLogin: string)
    {
        const {user} = request;

        if (!recieverLogin)
            throw new HttpException("recieverLogin filed needed", HttpStatus.BAD_REQUEST);
        if (recieverLogin === user.login)
        throw new HttpException("wtf you can't invite yourself", HttpStatus.BAD_REQUEST);

        const receiverUser = await this.userService.getByLogin(recieverLogin);
        if (!receiverUser)
            throw new HttpException("user not exist", HttpStatus.BAD_REQUEST);
        const requestExist = await this.friendshipService.getFriendship({sender: user, receiver: receiverUser});

        if (requestExist)
            throw new HttpException("You alerady send request to this user", HttpStatus.BAD_REQUEST)
        this.friendshipService.createFriendship(user, receiverUser);    
    }

    @UseGuards(JwtAuthGuard)
    @Post("acceptFriendRequest")
    @HttpCode(200)
    async acceptFriendRequest(request: RequestWithUser,
                              @Body("friendshipRequestId") friendshipRequestId: number)
    {
        const {user} = request;
        
        if (this.friendshipService.changeFriendshipStatus(user, friendshipRequestId, "accepted"))
        throw new HttpException("friendship request not exist", HttpStatus.BAD_REQUEST);
    }

    @UseGuards(JwtAuthGuard)
    @Post("declineFriendRequest")
    @HttpCode(200)
    async declineFriendRequest(request: RequestWithUser,
                              @Body("friendshipRequestId") friendshipRequestId: number)
    {
        const {user} = request;
        
        if (this.friendshipService.changeFriendshipStatus(user, friendshipRequestId, "declined"))
        throw new HttpException("friendship request not exist", HttpStatus.BAD_REQUEST);
    }
}