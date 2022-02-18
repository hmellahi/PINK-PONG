import { Injectable } from '@nestjs/common';
import { CreateChannelDto, DeleteChannelDto, UpdateChannelDto } from '../dtos/channel.dto';
import { Channel } from '../entites/channel';

@Injectable()
export class TmpChatService {
    channels: Channel[] = [];

    getChannels() {
        for (let i = 0; i < 5; i++) {
            let newChannel: Channel = {
                id: i,
                type: (i % 4 == 0) ? "public" : "private",
                name: "for fun",
                createdAt: new Date(),
                isLocked: (i % 3 == 0) ? true : false,
            };
            this.channels.push(newChannel);
        }
        return this.channels;
    }

    createChannel(data: CreateChannelDto) {
        console.log(data);
    }

    updateChannel(data: UpdateChannelDto) {
        console.log(data);
    }

    deleteChannel(data: DeleteChannelDto) {
        console.log(data);
    }
}
