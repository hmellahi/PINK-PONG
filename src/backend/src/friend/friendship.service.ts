import { array } from "@hapi/joi";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { response } from "express";
import { async } from "rxjs";
import BlockListEntity from "src/user/entities/blockedUserList.entity";
import UserEntity from "src/user/entities/user.entity"
import { UserService } from "src/user/user.service";
import { filteredUser } from "src/user/utils/user.utils";
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
    
    public async getFriendship(user1: UserEntity, user2: UserEntity)
    {
        return await this.friendshipRepository.findOne({
            where: [
                {sender: user1, receiver: user2},
                {sender: user2, receiver: user1}
            ]
        });
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


    public async getFriendshipRequests(user: UserEntity)
    {
        const friendshipRequests = (await this.friendshipRepository
                                        .find(
                                            {
                                                where: {receiver: user, status: "pending"},
                                                order: {create_date: "DESC"},
                                                relations: ["sender"]
                                            }
                                        ))
                                        .map(({sender, ...res}) => ({...res, sender: filteredUser(sender)}));
        return friendshipRequests;
    }


    public async getFriendships(user: UserEntity)
    {
        const friendships = []
        await Promise.all(
                (await this.friendshipRepository
                        .find(
                            {
                                where:  [
                                            {receiver: user, status: "accepted"},
                                            {sender: user, status: "accepted"},

                                        ],
                                order: {create_date: "DESC"},
                                relations: ["sender", "receiver"]
                            }
                        ))
                        .map(async ({sender, receiver, ...res}) =>
                        {
                            if (sender.id === user.id &&
                                !await this.userService.isBlockedUser(user, receiver))
                                friendships.push({...res, user: filteredUser(receiver)})
                            if (receiver.id === user.id &&
                                !await this.userService.isBlockedUser(user, sender))
                                    friendships.push({...res, user: filteredUser(sender)})
                        })
        )
        
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