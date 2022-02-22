import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { ChatService } from "./chat.service";
import { AddAdminDto, AddMemberDto, CreateChannelDto, JoinChannelDto, LeaveChannelDto, UpdateChannelPassword, } from "./dtos/channel.dto";
import { GetMessagesDto, MessageDto } from "./dtos/message.dto";

@UseGuards(JwtAuthGuard)

@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('createChannel')
    @HttpCode(200)
    async createChannel(@Req() request: RequestWithUser,
                     @Body() data: CreateChannelDto)
    {
        const {user} = request;
        data.owner = user;
        await this.chatService.createChannel(data);
    }

    @Get("channels")
    async getChannels(@Req() request: RequestWithUser)
    {
        const {user} = request;

        return await this.chatService.getChannels(user);
    }

    @Get("myChannels")
    async getMyChannels(@Req() request: RequestWithUser)
    {
        const {user} = request;

        return await this.chatService.getMyChannels(user);
    }

    @Post("joinChannel")
    @HttpCode(200)
    async joinChannel(@Req() request: RequestWithUser,
                        @Body() data: JoinChannelDto)
    {
        const {user} = request;

        data.user = user;
        await this.chatService.joinChannel(data);
    }

    @Post("addMember")
    @HttpCode(200)
    async addMember(@Req() request: RequestWithUser,
                    @Body() data:AddMemberDto)
    {
        const {user} = request;
        await this.chatService.addMember(user, data)
    }

    @Post("leaveChannel")
    @HttpCode(200)
    async leaveChannel(@Req() request: RequestWithUser,
                        @Body() data: LeaveChannelDto)
    {
        const {user} = request;
        await this.chatService.leaveChannel(user, data);
    }

    @Post("updateChannelPassword")
    @HttpCode(200)
    async updateChannelPassword(@Req() request: RequestWithUser,
                                @Body() data: UpdateChannelPassword)
    {
        const {user} = request;
        await this.chatService.updateChannelPassword(user, data);
    }



    @Post("addAdmin")
    @HttpCode(200)
    async addAdmin(@Req() request: RequestWithUser,
                                @Body() data: AddAdminDto)
    {
        const {user} = request;
        await this.chatService.addAdmin(user, data);
    }

    /****
     * just for testing
     ****/
    @Post("createMessage")
    @HttpCode(200)
    async createMessages(@Req() request: RequestWithUser, @Body() msg: MessageDto)
    {
        await this.chatService.createMessage(request.user, msg);
    }

    @Get("getAllMessages")
    async getAllMessages(@Req() request: RequestWithUser,@Body() data: GetMessagesDto)
    {
        return await this.chatService.getAllMessages(request.user, data);
    }

}