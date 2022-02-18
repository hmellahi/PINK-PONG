import { Body, Controller, Delete, Post, Put } from "@nestjs/common";
import { CreateChannelDto, UpdateChannelDto, } from "../dtos/channel.dto";
import { TmpChatService } from "../services/chat.service";


@Controller("chat")
export class ChannelsController {

    constructor(private chatService: TmpChatService) { }


    @Post('createChannel')
    createChannel(@Body() data: CreateChannelDto) {
        this.chatService.createChannel(data);
    }

    @Put('updateChannel')
    updateChannel(@Body() data: UpdateChannelDto) {
        this.chatService.updateChannel(data);
    }

    @Delete('deleteChannel')
    deleteChannel(@Body() data: UpdateChannelDto) {
        this.chatService.deleteChannel(data);
    }

}