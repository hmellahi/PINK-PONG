import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserEntity from "src/user/entities/user.entity"
import {Repository } from "typeorm";
import FriendshipEntity from "./entities/friendship.entity";
import { Friendship_Status , FriendshipStatus} from "./Interfaces/friendship.interface";

@Injectable()
export class FriendshipService
{
    constructor(
        @InjectRepository(FriendshipEntity)
        private friendshipRepository: Repository<FriendshipEntity>
    ){}

    public async createFriendship(sender: UserEntity, receiver: UserEntity)
    {
        const friendship = new FriendshipEntity();

        friendship.sender = sender;
        friendship.receiver = receiver;

        const newFriendship = this.friendshipRepository.create(friendship);
        return await this.friendshipRepository.save(newFriendship);
    }

    public async getFriendship(opts:any)
    {
        console.log(opts)
        return await this.friendshipRepository
                                    .findOne(opts)
    }

    public async changeFriendshipStatus(sender: UserEntity,
                                        friendshipRequestId: number,
                                        requiredStatus: Friendship_Status)
    {

        const friendship = await this.getFriendship({id: friendshipRequestId});
        console.log(friendship)
        if (!friendship || friendship.status === requiredStatus)
            return false;
        friendship.status = requiredStatus;
        this.friendshipRepository.save(friendship);
        return true;
    }

    public async getFriendshipRequests(user: UserEntity)
    {
        const friendships = await this.friendshipRepository
                                    .createQueryBuilder("f")
                                    .innerJoin("f.sender", "user", "f.receiverId = :recevierId AND f.status = :status",
                                                        { recevierId: user.id , status: "pending"})
                                    .addSelect(["user.id","user.login", "user.avatar_url"])
                                    .orderBy("f.create_date", "DESC")
                                    .getMany()
        
        return friendships;
    }
}