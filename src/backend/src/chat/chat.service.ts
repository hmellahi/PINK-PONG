import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto, DeleteChannelDto, JoinChannelDto, UpdateChannelDto } from './dtos/channel.dto';
import ChannelEntity  from './entities/channel.entity';
import * as bcrypt from "bcrypt";
import { AuthService } from 'src/authentication/auth.service';
import UserEntity from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
        private readonly authService: AuthService
    ) { }


    async createChannel(data: CreateChannelDto)
    {
        if (data.isLocked)
            data.password = await bcrypt.hash(data.password, 10);   
        const newChannel = this.channelRepository.create({...data, participants:[data.owner]});
        return await this.channelRepository.save(newChannel);
    }

    async getChannels(user:UserEntity) {
        return (await this.channelRepository
                            .find(
                                {
                                    where: {type: "public"},
                                    relations:["owner", "participants"]}
                                ))
                            .map((channel)=>
                            {
                                if (!this.alreadyJoined(channel, user))
                                    return channel;
                            }); // it's need to be filtered
    }

    async joinChannel(data: JoinChannelDto)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {
                                        where: {id:data.channelId},
                                        relations: ['participants']
                                    }
                            );

        if (!channel || this.alreadyJoined(channel, data.user))
            throw new HttpException("Channel not found or You already Joined", HttpStatus.NOT_FOUND);
        
        if (channel.isLocked)
        {
            if (!data.password)
                throw new HttpException("Password field not exist", HttpStatus.BAD_REQUEST);
            await this.authService.verifyPassword(channel.password,data.password);
        }

        channel.participants.push(data.user);
        await this.channelRepository.save(channel);
    }

    async addParticipant(member: UserEntity, newMember: UserEntity,
                        channelId: number)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {
                                        where: { id: channelId},
                                        relations: ['participants']
                                    }
                                );
        if (!this.alreadyJoined(channel, member))
            throw new ForbiddenException;
        channel.participants.push(newMember);
        await this.channelRepository.save(channel);
                                    
    }
    updateChannel(data: UpdateChannelDto) {
        console.log(data);
    }

    deleteChannel(data: DeleteChannelDto) {
        console.log(data);
    }

    private alreadyJoined(channel: ChannelEntity, userToFind: UserEntity)
    {
        return channel.participants.find(user => user.id === userToFind.id);
    }
}
