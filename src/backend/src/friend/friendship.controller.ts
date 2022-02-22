import { Body, Controller, Get, HttpCode,
         HttpException, HttpStatus, Post,
         Req, Res, UseGuards
        } from "@nestjs/common";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { UserService } from "src/user/user.service";
import { FriendshipService } from "./friendship.service";

@UseGuards(JwtAuthGuard)
@Controller("friendship")

export class FriendshipController
{
    constructor(
        private friendshipService: FriendshipService,
        private userService: UserService
    ){}

    @Get("friendshipRequests")
    async friendshipRequests(@Req() request: RequestWithUser)
    {
        const {user} = request;
        return this.friendshipService.getFriendshipRequests(user);
    }

    @Get("friendships")
    async friendships(@Req() request: RequestWithUser)
    {
        const {user} = request;
        return this.friendshipService.getFriendships(user);
    }

    @Post("sendFriendRequest")
    @HttpCode(200)
    async sendFriendRequest(@Req() request: RequestWithUser,@Body("recieverLogin") recieverLogin: string)
    {
        const {user} = request;

        if (!recieverLogin)
            throw new HttpException("recieverLogin filed needed", HttpStatus.BAD_REQUEST);
        if (recieverLogin === user.login)
        throw new HttpException("wtf you can't invite yourself", HttpStatus.BAD_REQUEST);

        const receiverUser = await this.userService.getByLogin(user,recieverLogin);
        if (!receiverUser)
            throw new HttpException("user not exist", HttpStatus.BAD_REQUEST);
        const requestExist = await this.friendshipService.getFriendship(user, receiverUser);

        if (requestExist)
            throw new HttpException("You alerady send request to this user", HttpStatus.BAD_REQUEST)
        await this.friendshipService.createFriendship(user, receiverUser);    
    }

    @Post("acceptFriendRequest")
    @HttpCode(200)
    async acceptFriendRequest(@Req() request: RequestWithUser,
                              @Body("friendshipRequestId") friendshipRequestId: number) // validation of id must done
    {
        const {user} = request;
        
        if (!friendshipRequestId)
            throw new HttpException("friendshipRequestId filed needed", HttpStatus.BAD_REQUEST);
        if (!await this.friendshipService.changeFriendshipStatus(user, friendshipRequestId, "accepted"))
            throw new HttpException("Friendship Request not exist", HttpStatus.BAD_REQUEST);

    }

    @Post("declineFriendRequest")
    @HttpCode(200)
    async declineFriendRequest(@Req()request: RequestWithUser,
                              @Body("friendshipRequestId") friendshipRequestId: number)
    {
        const {user} = request;
        
        
        if (!friendshipRequestId)
            throw new HttpException("friendshipRequestId filed needed", HttpStatus.BAD_REQUEST);

        if (!await this.friendshipService.changeFriendshipStatus(user, friendshipRequestId, "declined")) // need to update
            throw new HttpException("friendship request not exist", HttpStatus.BAD_REQUEST);
    }

    @Post("removeFriendship")
    @HttpCode(200)
    async removeFriendship(@Req() request: RequestWithUser,
                            @Body("friendshipId") friendshipId: number)
    {
        const {user} = request;

        if (!friendshipId)
            throw new HttpException("friendshipId filed needed", HttpStatus.BAD_REQUEST);
        if (!await this.friendshipService.removeFriendship(friendshipId, user))
            throw new HttpException("friendship not exist", HttpStatus.BAD_REQUEST);
    }
}