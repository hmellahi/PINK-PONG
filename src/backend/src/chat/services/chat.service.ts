import { Injectable } from '@nestjs/common';
import { Channel } from '../entites/channel';

@Injectable()
export class ChatService {

    getChannels() {
        let channels: Channel[] = [];
        for (let i = 0; i < 15; i++) {
            let newChannel: Channel = {
                type: (i % 4 == 0) ? "public" : "private",
                name: "for fun",
                createdAt: new Date(),
                isLocked: (i % 3 == 0) ? true : false,
            };
            channels.push(newChannel);
        }
        return channels;
    }
}
