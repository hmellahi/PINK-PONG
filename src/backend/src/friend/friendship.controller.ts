import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { UserService } from "src/user/user.service";
import { FindOneOptions } from "typeorm";
import { FriendshipService } from "./friendship.service";
// import FriendshipEntity from "./entities/friendship.enitity"
import { FriendshipStatus } from "./Interfaces/friendship.interface";

@Controller("friendship")

export class FriendshipController
{
    constructor(
        private friendshipService: FriendshipService,
        private userService: UserService
    ){}

    // @UseGuards(JwtAuthGuard)
    // @Post("sendFriendRequest")
    // @HttpCode(200)
    // async sendFriendRequest(request: RequestWithUser,@Body("recieverLogin") recieverLogin: string)
    // {
    //     const {user} = request;

    //     const receiverUser = await this.userService.getByLogin(recieverLogin);
    //     if (!receiverUser)
    //         throw new HttpException("user not exist", HttpStatus.BAD_REQUEST);
    //     const requestExist = await this.friendshipService.getFriendship({sender: user, receiver: receiverUser});

    //     if (requestExist)
    //         throw new HttpException("You alerady send request to this user", HttpStatus.BAD_REQUEST)
    //     this.friendshipService.createFriendship(user, receiverUser);    
    // }

    // @UseGuards(JwtAuthGuard)
    // @Post("acceptFriendRequest")
    // @HttpCode(200)
    // async acceptFriendRequest(request: RequestWithUser,
    //                           @Body("friendshipRequestId") friendshipRequestId: number)
    // {
    //     const {user} = request;
        
    //     if (this.friendshipService.changeFriendshipStatus(user, friendshipRequestId, "accepted"))
    //     throw new HttpException("friendship request not exist", HttpStatus.BAD_REQUEST);
    // }

    // @UseGuards(JwtAuthGuard)
    // @Post("declineFriendRequest")
    // @HttpCode(200)
    // async declineFriendRequest(request: RequestWithUser,
    //                           @Body("friendshipRequestId") friendshipRequestId: number)
    // {
    //     const {user} = request;
        
    //     if (this.friendshipService.changeFriendshipStatus(user, friendshipRequestId, "declined"))
    //     throw new HttpException("friendship request not exist", HttpStatus.BAD_REQUEST);
    // }
}