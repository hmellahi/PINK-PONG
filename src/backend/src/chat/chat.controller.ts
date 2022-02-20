import { Body, Controller, Delete, Post, Put } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChannelDto, DeleteChannelDto, UpdateChannelDto, } from "./dtos/channel.dto";


@Controller("chat")
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('createChannel')
    createChannel(@Body() data: CreateChannelDto) {
        this.chatService.createChannel(data);
    }

    @Put('updateChannel')
    updateChannel(@Body() data: UpdateChannelDto) {
        this.chatService.updateChannel(data);
    }

    @Delete('deleteChannel')
    deleteChannel(@Body() data: DeleteChannelDto) {
        this.chatService.deleteChannel(data);
    }

}