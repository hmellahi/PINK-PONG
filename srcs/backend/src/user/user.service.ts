import { forwardRef, HttpCode, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import UserEntity from './entities/user.entity';
import * as bcrypt from "bcrypt";
import BlockListEntity from './entities/blockedUserList.entity';
import { FriendshipService } from 'src/friend/friendship.service';
import { filteredUser } from './utils/user.utils';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(BlockListEntity)
        private blockListRepository: Repository<BlockListEntity>,

        @Inject(forwardRef(()=> FriendshipService))
        private friendshipService: FriendshipService
    ){}

    public async createUser(user: CreateUserDto)
    {
        const newUser =  this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    public async getByEmail(email: string): Promise<UserEntity>
    {
        return await this.userRepository.findOne({email: email});
    }

    public async getById(id: number)
    {
        const user = await this.userRepository.findOne({id});

        if(user)
            return user;
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    public async getByLogin(user: UserEntity,login: string)
    {
        const fetchedUser = await this.userRepository.findOne({login});

        if (!fetchedUser)
            return fetchedUser;
        const isFriend = await this.friendshipService.isFriend(user, fetchedUser);

        return  {...fetchedUser, isFriend};
    }

    public async findByIdAndUpdate(id:number, updatedUser)
    {
        await this.userRepository.update(id, updatedUser);
    }
    
    public async setRefreshToken(userId: number,token: string)
    {
        const user = await this.userRepository.findOne(userId);
        let hashToken: string;

        if (user)
        {
            hashToken = await bcrypt.hash(token, 10);
            user.currentRefreshToken = hashToken;
            this.userRepository.save(user);
        }
    }
    public async removeRefreshToken(userId: number)
    {
        const user = await this.userRepository.findOne(userId);

        if (user)
        {
            user.currentRefreshToken = null;
            this.userRepository.save(user);
        } 
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, id: number)
    {
        const user = await this.userRepository.findOne({id});

        if (user)
        {
            if (await bcrypt.compare(refreshToken, user.currentRefreshToken))
                return user;
        }
        throw new UnauthorizedException;  // need to update
    }

    async blockUser(user: UserEntity,id: number)
    {
        const toBlockUser = await this.getById(id);
        
        if (!toBlockUser || 
            await this.blockListRepository.findOne({blocker: user, blocked: toBlockUser}))
            return false;
        
        const newBlockList = new BlockListEntity();
        newBlockList.blocker = user;
        newBlockList.blocked = toBlockUser;
        await this.blockListRepository.save(newBlockList);
        return true;
    }

    async unblockUser(user: UserEntity, id: number)
    {
        const blockList =  await this.blockListRepository
                                    .findOne({blocker: user, id});
        if (!blockList)
            return false;
        await this.blockListRepository.remove(blockList);
        return true;
    }

    async getBlockedList(user: UserEntity)
    {
        return (await this.blockListRepository
                            .find
                            (
                                {
                                    where: {blocker: user},
                                    order: {create_date: "DESC"},
                                    relations: ['blocked']
                                }
                            ))
                            .map(({blocked,...res}) => { return ({...res, user: filteredUser(blocked)})});
    }

    async isBlockedUser(blocker: UserEntity, blocked: UserEntity)
    {
        return await this.blockListRepository.findOne({blocker: blocker, blocked});
    }

    async getUsersByGames()
    {
        return (await this.userRepository.find(
            {
                order: {
                    wins: "DESC"
                }
            }
        )).map((user)=> (filteredUser(user)))
    }

    async increaseWins(user: UserEntity)
    {
        user.wins += 1;
        await this.userRepository.save(user);
    }

    async increatLosses(user: UserEntity)
    {
        user.losses += 1;
        await this.userRepository.save(user)
    }
}
