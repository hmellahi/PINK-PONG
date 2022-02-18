import { Body, Controller, Delete, Post, Put } from "@nestjs/common";
import { CreateChannelDto, DeleteChannelDto, UpdateChannelDto, } from "../dtos/channel.dto";
import { TmpChatService } from "../services/chat.service";


@Controller("chat")
export class ChannelsController {

    constructor(private chatService: TmpChatService) { }


    @Post('createChannel')
    createChannel(@Body() data: CreateChannelDto) {
        this.chatService.createChannel(data);
        // if success
        // this.server.emit('channels', this.chatService.getChannels());
    }

    @Put('updateChannel')
    updateChannel(@Body() data: UpdateChannelDto) {
        this.chatService.updateChannel(data);
        // if success
        // this.server.emit('channels', this.chatService.getChannels());
    }

    @Delete('deleteChannel')
    deleteChannel(@Body() data: DeleteChannelDto) {
        this.chatService.deleteChannel(data);
        // if success
        // this.server.emit('channels', this.chatService.getChannels());
    }

}