import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { AddAdminDto, AddMemberDto, BanUserDto, CreateChannelDto, JoinChannelDto, LeaveChannelDto, MuteMemberDto, UpdateChannelPassword } from './dtos/channel.dto';
import ChannelEntity  from './entities/channel.entity';
import * as bcrypt from "bcrypt";
import { AuthService } from 'src/authentication/auth.service';
import UserEntity from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DmMessageDto, GetDmMessagesDto, GetMessagesDto, MessageDto } from './dtos/message.dto';
import MessageEntity from './entities/message.entity';
import { filteredUser } from 'src/user/utils/user.utils';
import { getRole, isAdmin, isBaned, isMember } from './utils/chat.utils';
import MutedListEntity from './entities/mute.entity';
import * as moment from 'moment';
import MutedList from './entities/mute.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
        @InjectRepository(MessageEntity)
        private readonly messgaeRepository: Repository<MessageEntity>,
        @InjectRepository(MutedListEntity)
        private readonly mutedListRepository: Repository<MutedListEntity>,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }


    async createChannel(data: CreateChannelDto)
    {
        if (data.isLocked)
            data.password = await bcrypt.hash(data.password, 10);   
        const newChannel = this.channelRepository.create({...data, members:[data.owner], admins:[data.owner]});
        const id : number = (await this.channelRepository.save(newChannel)).id;
        return {id};
    }

    async getChannels(user:UserEntity) {

        let channels = [];
        (await this.channelRepository
                            .find(
                                {
                                    where: {type: "public"},
                                    relations:["members"]}
                                ))
                            .map(({members,password,...channel})=>
                            {
                                if (!isMember(members, user))
                                    channels.push({...channel, membersCount: members.length});
                            }); // it's need to be filtered
        return channels;
    }

    
    async getAllDms(user:UserEntity)
    {
        let dms = [];
        (await this.channelRepository
                            .find(
                                {
                                    where: {type: "dms"},
                                    relations:["members"]}
                                ))
                            .map(({members,password,...channel})=>
                            {
                                if (isMember(members, user))
                                {
                                    dms.push(
                                        {   
                                            ...channel,
                                            user: filteredUser(members.filter(u => u.id !== user.id)[0])
                                        });
                                }
                            });
        return dms;   
    }

    async getMyChannels(user:UserEntity) {
        let channels = [];
        (await this.channelRepository
                            .find(
                                {
                                    where: [{type: "public"}, {type: "private"}],
                                    relations:["members"]}
                                ))
                            .map(({members,password,...channel})=>
                            {
                                if (isMember(members, user))
                                    channels.push({...channel, membersCount: members.length});
                            });
        return channels;
    }

    async joinChannel(data: JoinChannelDto)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {
                                        where: {id:data.channelId},
                                        relations: ['members', 'bandedUsers']
                                    }
                            );

        if (!channel || isMember(channel.members, data.user))
            throw new HttpException("Channel not found or You already Joined", HttpStatus.NOT_FOUND);
        if (isBaned(channel.bandedUsers, data.user))
            throw new HttpException("You are baned from this channel", HttpStatus.FORBIDDEN);
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
        if (!isMember(channel.members, member))
            throw new ForbiddenException;
        if (isMember(channel.members, newMember))
            throw new HttpException("User already a member", HttpStatus.BAD_REQUEST);
        channel.members.push(newMember);
        await this.channelRepository.save(channel);                           
    }

    async leaveChannel(member: UserEntity, data: LeaveChannelDto)
    {   
        const channel = await this.channelRepository.findOne({id:data.channelId}, {relations: ['members']});

        if (!channel || !isMember(channel.members, member))
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
             !isAdmin(channel.admins, member))
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
        if (!channel || isAdmin(channel.admins, newAdmin))
            throw new HttpException("Channel not exist  or User already admin", HttpStatus.BAD_REQUEST);
        if (!isAdmin(channel.admins, member))
            throw new ForbiddenException;
        channel.admins.push(newAdmin);
        await this.channelRepository.save(channel);
    }

    public async ban_Kick_Member(member: UserEntity,data: BanUserDto)
    {
        const {channel, user} = await this.getChannel_Kick_Ban_Mute(member, data);

        if (data.isPermanant)
            channel.bandedUsers.push(user);
        channel.members = channel.members.filter((u)=> u.id !== data.userId);
        await this.channelRepository.save(channel);
    }

    public async muteMember(member: UserEntity, data: MuteMemberDto)
    {
        const {channel, user} = await this.getChannel_Kick_Ban_Mute(member, data);

        await this.isMuted(channel, user, new Date(data.expireDate), true)
        const newMustedList = new MutedList();

        newMustedList.expireDate = data.expireDate;
        newMustedList.mutedUser = user;
        newMustedList.channel = channel;

        await this.mutedListRepository.save(newMustedList);
    }

    private async getChannel_Kick_Ban_Mute(member: UserEntity, data: BanUserDto | MuteMemberDto)
    {
        const user = await this.userService.getById(data.userId);
        const channel = await this.channelRepository
                                    .findOne(
                                           { id:data.channelId},
                                           { relations: ["owner", "admins", "members",
                                                        "bandedUsers"]}
                                    );
        if (!channel)
            throw new HttpException("Channel not exist", HttpStatus.BAD_REQUEST);
        if (!isMember(channel.members, user))
            throw new HttpException("user not a member", HttpStatus.BAD_REQUEST);
        if (!isAdmin(channel.admins, member) ||
            (isAdmin(channel.admins, user) && (!channel.owner || channel.owner.id !== member.id))||
            channel.owner.id === data.userId)
            throw new HttpException("You have not permission to this action", HttpStatus.FORBIDDEN);
        return {user, channel}
    }

    // Messages

    async createMessage(member: UserEntity, data: MessageDto)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {id: data.channelId},
                                    {relations:['members']});
        if (!channel || !isMember(channel.members, member))
            throw new HttpException("channel not found or user is not member", HttpStatus.NOT_FOUND);
        await this.isMuted(channel, member,new Date(),false);
       const message = this.messgaeRepository.create({msg: data.msg, owner: member, channel: channel});
       await this.messgaeRepository.save(message);
    }

    async getAllMessages(member: UserEntity, data: GetMessagesDto)
    {
        const channel = await this.channelRepository
                                .findOne(
                                    {id: data.channelId},
                                    {relations:['members', 'admins', 'owner']});
        if (!channel || !isMember(channel.members, member))
            throw new HttpException("channel not found or user is not member", HttpStatus.NOT_FOUND);
        let messages  = [];
        await Promise.all((await this.messgaeRepository
                                    .find(
                                        {
                                            where: {channel: channel},
                                            relations: ['owner'],
                                            order: {create_date: "ASC"}
                                        }))
                                    .map(async ({owner, ...res})=>
                                    {
                                        if (!await this.userService.isBlockedUser(member, owner))
                                        {
                                            messages.push(
                                                {...res, 
                                                owner: {...filteredUser(owner),
                                                        role: getRole(owner, channel)},
                                                channelId: channel.id})
                                        }
                                    }));
        
        return {role: getRole(member, channel), messages: messages}
    }

    private async getDmChannel(member1: UserEntity, member2: UserEntity)
    {
        let ch: any = undefined;
        (await this.channelRepository
            .find(
                {
                    where:[
                        {owner: member1, type: 'dms'},
                        {owner: member2, type: 'dms'}
                    ],
                    relations:['members']
                }
            ))
            .map((channel) =>
            {
                if(isMember(channel.members, member1) &&
                        isMember(channel.members, member2))
                ch = channel;
            });
        return ch
    }

    async getDmsMessages(member: UserEntity, data: GetDmMessagesDto)
    {
        const user = await this.userService.getById(data.userId);

        const channel = await this.getDmChannel(member, user);
        if (channel)
            return this.getAllMessages(member, {channelId: channel.id});
        return [];
    }

    async createDmMessage(member: UserEntity, data: DmMessageDto)
    {
        const user = await this.userService.getById(data.userId);

        let channel : any  = await this.getDmChannel(member, user);
        let id: number;

        if (!channel)
        {
            channel = await this.createChannel({
                owner: member,
                type: "dms",
                isLocked: false,
                name: "dms"
            });
            //logic is fuck up here
            await this.addMember(member, {login:user.login, channelId:channel.id})
        }
        this.createMessage(member, {
            msg: data.msg,
            channelId: channel.id 
        })

    }

    private async isMuted(channel:ChannelEntity,user: UserEntity,
                          expireDate: Date, flag: boolean)
    {
        const currentDate = new Date();

        if (flag && currentDate > expireDate)
            throw new HttpException("wtf given date is in the past", HttpStatus.BAD_REQUEST);
        const mutedList = await this.mutedListRepository
                                     .findOne(
                                         {
                                             where: { mutedUser: user, channel: channel, expireDate: MoreThan(currentDate)}
                                         })
        if (mutedList) {
            const timeLeft = moment(mutedList.expireDate).fromNow();
            throw new HttpException(
                `you are Muted, you will be able to send messages ${timeLeft}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

}