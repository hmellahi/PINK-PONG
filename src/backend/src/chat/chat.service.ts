import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto, DeleteChannelDto, UpdateChannelDto } from './dtos/channel.dto';
import ChannelEntity  from './entities/channel.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
    ) { }

    async getChannels() {
        return await this.channelRepository.find();
    }

    async createChannel(data: CreateChannelDto) {
        //return //await this.channelRepository.save(data);
        console.log(data)
    }

    updateChannel(data: UpdateChannelDto) {
        console.log(data);
    }

    deleteChannel(data: DeleteChannelDto) {
        console.log(data);
    }
}
