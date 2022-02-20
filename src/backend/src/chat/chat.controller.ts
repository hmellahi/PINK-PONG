import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/authentication/Guards/jwtAccess.guard";
import { RequestWithUser } from "src/authentication/Interfaces/requestWithUser.interface";
import { ChatService } from "./chat.service";
import { CreateChannelDto, DeleteChannelDto, JoinChannelDto, UpdateChannelDto, } from "./dtos/channel.dto";

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

    @Post("joinChannel")
    @HttpCode(200)
    async joinChannel(@Req() request: RequestWithUser,
                        @Body() data: JoinChannelDto)
    {
        const {user} = request;

        data.user = user;
        await this.chatService.joinChannel(data);
    }

    @Post('updateChannel')
    updateChannel(@Body() data: UpdateChannelDto) {
        this.chatService.updateChannel(data);
    }

    @Delete('deleteChannel')
    deleteChannel(@Body() data: DeleteChannelDto) {
        this.chatService.deleteChannel(data);
    }

}