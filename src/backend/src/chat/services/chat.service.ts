import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto, DeleteChannelDto, UpdateChannelDto } from '../dtos/channel.dto';
import { ChannelPostEntity } from '../entities/channel.entity';

@Injectable()
export class TmpChatService {
    constructor(
        @InjectRepository(ChannelPostEntity)
        private readonly channelPostRepository: Repository<ChannelPostEntity>,
    ) { }

    async getChannels() {
        return await this.channelPostRepository.find();
    }

    createChannel(data: CreateChannelDto) {
        return this.channelPostRepository.save(data);
    }

    updateChannel(data: UpdateChannelDto) {
        console.log(data);
    }

    deleteChannel(data: DeleteChannelDto) {
        console.log(data);
    }
}
