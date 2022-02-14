import { array } from "@hapi/joi";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { response } from "express";
import { async } from "rxjs";
import BlockListEntity from "src/user/entities/blockedUserList.entity";
import UserEntity from "src/user/entities/user.entity"
import { UserService } from "src/user/user.service";
import {Repository } from "typeorm";
import FriendshipEntity from "./entities/friendship.entity";
import { Friendship_Status , FriendshipStatus} from "./Interfaces/friendship.interface";

@Injectable()
export class FriendshipService
{
    constructor(
        @InjectRepository(FriendshipEntity)
        private friendshipRepository: Repository<FriendshipEntity>,
        @Inject(forwardRef(()=> UserService))
        private userService: UserService
    ){}

    public async createFriendship(sender: UserEntity, receiver: UserEntity)
    {
        const friendship = new FriendshipEntity();

        friendship.sender = sender;
        friendship.receiver = receiver;

        const newFriendship = this.friendshipRepository.create(friendship);
        return await this.friendshipRepository.save(newFriendship);
    }

    private async getFriendshipByIdAndUser(id: number, user: UserEntity)
    {
        return await this.friendshipRepository
                        .findOne({
                             where:[
                                {id: id, sender: user},
                                {id: id, receiver: user}

                            ]
                        })
    }
    
    public async getFriendship(ops: any)
    {
        return await this.friendshipRepository.findOne(ops);
    }
    public async isFriend(user1: UserEntity, user2: UserEntity)
    {
        return (await this.friendshipRepository
                                    .findOne({where: [
                                        {status: "accepted", sender: user1, receiver: user2},
                                        {status: "accepted", sender: user2, receiver: user1}
                                    ]})) != undefined;
    }

    public async changeFriendshipStatus(user: UserEntity,
                                        friendshipRequestId: number,
                                        requiredStatus: Friendship_Status)
    {

        const friendshipRequest = await this.friendshipRepository
                                            .findOne(
                                                {
                                                    id: friendshipRequestId,
                                                    receiver: user}
                                                );
        if (!friendshipRequest || friendshipRequest.status == requiredStatus)
            return false;
            friendshipRequest.status = requiredStatus;
        this.friendshipRepository.save(friendshipRequest);
        return true;
    }

    public async getFriendshipRequests(userId: number)
    {
        const friendshipRequests = await this.friendshipRepository
                                    .createQueryBuilder("f")
                                    .innerJoin("f.sender", "s", "f.receiverId = :recevierId AND f.status = :status",
                                                        { recevierId: userId , status: "pending"})
                                    .addSelect(["s.id","s.login", "s.avatar_url"])
                                    .orderBy("f.create_date", "DESC")
                                    .getMany()
        return friendshipRequests;
    }


    public async getFriendships(user: UserEntity)
    {
        let friendships = [];
        const asReceiver = await Promise.all((await this.friendshipRepository
                                        .createQueryBuilder("f")
                                        .innerJoin("f.sender", "s", "f.receiverId = :recevierId AND f.status = :status",
                                                    { recevierId: user.id , status: "accepted"})
                                        .addSelect(["s.id","s.login", "s.avatar_url"])
                                        .orderBy("f.create_date", "DESC")
                                        .getMany())
                                        .map(async ({sender, ...res}) =>
                                        {
                                            if (!await this.userService.isBlockedUser(user, sender))
                                                friendships.push({...res, user: sender})
                                        }))


        const asSender = await Promise.all((await this.friendshipRepository
                                        .createQueryBuilder("f")
                                        .innerJoin("f.receiver", "r", "f.senderId = :senderId AND f.status = :status",
                                                    { senderId: user.id , status: "accepted"})
                                        .addSelect(["r.id","r.login", "r.avatar_url"])
                                        .orderBy("f.create_date", "DESC")
                                        .getMany())
                                        .map(async ({receiver, ...res}) =>
                                        {
                                            if (!await this.userService.isBlockedUser(user, receiver))
                                                friendships.push({...res, user: receiver})
                                        }))
        
        return friendships;
    }

    public async removeFriendship(friendshipId: number, user: UserEntity)
    {

        const friendship = await this.getFriendshipByIdAndUser(
            friendshipId, user
        );

        if (!friendship)
            return false;
        await this.friendshipRepository
                                .remove(friendship);
        return true;
    }
}