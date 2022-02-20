import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddAdminDto, AddMemberDto, CreateChannelDto, JoinChannelDto, LeaveChannelDto, UpdateChannelPassword } from './dtos/channel.dto';
import ChannelEntity  from './entities/channel.entity';
import * as bcrypt from "bcrypt";
import { AuthService } from 'src/authentication/auth.service';
import UserEntity from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }


    async createChannel(data: CreateChannelDto)
    {
        if (data.isLocked)
            data.password = await bcrypt.hash(data.password, 10);   
        const newChannel = this.channelRepository.create({...data, members:[data.owner], admins:[data.owner]});
        return await this.channelRepository.save(newChannel);
    }

    async getChannels(user:UserEntity) {
        return (await this.channelRepository
                            .find(
                                {
                                    where: {type: "public"},
                                    relations:["owner", "members", "admins"]}
                                ))
                            .filter((channel)=>
                            {
                                if (!this.isMember(channel, user))
                                    return channel;
                            }); // it's need to be filtered
    }

    async getMyChannels(user:UserEntity) {
        return (await this.channelRepository
                            .find(
                                {
                                    relations:["owner", "members", "admins"]}
                                ))
                            .filter((channel)=>
                            {
                                if (this.isMember(channel, user))
                                    return channel;
                            }); // it's need to be filtered
    }

    async joinChannel(data: JoinChannelDto)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {
                                        where: {id:data.channelId},
                                        relations: ['members']
                                    }
                            );

        if (!channel || this.isMember(channel, data.user))
            throw new HttpException("Channel not found or You already Joined", HttpStatus.NOT_FOUND);
        
        if (channel.isLocked)
        {
            if (!data.password)
                throw new HttpException("Password field not exist", HttpStatus.BAD_REQUEST);
            await this.authService.verifyPassword(channel.password,data.password);
        }

        channel.members.push(data.user);
        await this.channelRepository.save(channel);
    }

    async addMember(member: UserEntity, data: AddMemberDto)
    {
        const newMember = await this.userService.getByLogin(member,data.login);

        if (!newMember)
            throw new HttpException("user not exist", HttpStatus.NOT_FOUND);
        const channel = await this.channelRepository
                                .findOne(
                                    {
                                        where: { id: data.channelId},
                                        relations: ['members']
                                    }
                                );
        if (!this.isMember(channel, member))
            throw new ForbiddenException;
        if (this.isMember(channel, newMember))
            throw new HttpException("User already a member", HttpStatus.BAD_REQUEST);
        channel.members.push(newMember);
        await this.channelRepository.save(channel);                           
    }

    async leaveChannel(member: UserEntity, data: LeaveChannelDto)
    {   
        const channel = await this.channelRepository.findOne({id:data.channelId}, {relations: ['members']});

        if (!channel || !this.isMember(channel, member))
            throw new HttpException("Channel not found or User not A member", HttpStatus.BAD_REQUEST);
        
        await this.channelRepository
                                .createQueryBuilder()
                                .relation('members')
                                .of({id: data.channelId})
                                .remove(member);
        await this.channelRepository
                                .createQueryBuilder()
                                .relation('admins')
                                .of({id: data.channelId})
                                .remove(member);

        await this.channelRepository
                                .update({id: data.channelId, owner: member}, {owner: null})    
    }

    public async  updateChannelPassword(member: UserEntity, data:UpdateChannelPassword)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {id: data.channelId}, 
                                    {relations:['owner', 'admins']}
                            );
        if (!channel)
            throw new HttpException("Channel not exist", HttpStatus.NOT_FOUND);
        //checking if this member is the owner or admin
        if ((!channel.owner || channel.owner.id !== member.id) &&
             !this.isAdmin(channel, member))
            throw new UnauthorizedException;
        if (data.isLocked)
            channel.password = await bcrypt.hash(data.password, 10);
        channel.isLocked = data.isLocked;
        await this.channelRepository.save(channel);
    }

    public async addAdmin(member: UserEntity, data:AddAdminDto)
    {
        const newAdmin = await this.userService.getById(data.userId);

        const channel = await this.channelRepository
                                .findOne(
                                    {id: data.channelId},
                                    {relations: ['admins']}
                                );
        if (!channel || this.isAdmin(channel, newAdmin))
            throw new HttpException("Channel not exist  or User already admin", HttpStatus.BAD_REQUEST);
        if (!this.isAdmin(channel, member))
            throw new ForbiddenException;
        await this.channelRepository
                .createQueryBuilder()
                .relation('admins')
                .of({id: data.channelId})
                .add(newAdmin);
    }

    private isMember(channel: ChannelEntity, userToFind: UserEntity)
    {
        return channel.members.find(user => user.id === userToFind.id);
    }

    private isAdmin(channel: ChannelEntity, userToFind: UserEntity)
    {
        return channel.admins.find(user => user.id === userToFind.id);
    }
}
