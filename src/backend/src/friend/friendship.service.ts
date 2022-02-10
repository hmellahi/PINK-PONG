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
        return await this.friendshipRepository
                                    .findOne(opts)
    }

    public async changeFriendshipStatus(receiverId: number,
                                        friendshipRequestId: number,
                                        requiredStatus: Friendship_Status)
    {

        const friendship = await this.friendshipRepository
                                    .createQueryBuilder("f")
                                    .innerJoin("f.sender", "user", "f.receiverId = :recevierId AND f.status != :status",
                                                        { recevierId: receiverId , status: requiredStatus})
                                    .getOne();
        if (!friendship)
            return false;
        friendship.status = requiredStatus;
        this.friendshipRepository.save(friendship);
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
        // const friendships = await this.friendshipRepository
        //                             .createQueryBuilder("f")
        //                             .select(["u.id", "u.email"])
        //                             .innerJoin("f.sender","u")
        //                             .where("status = :status", {status:"accepted"})
        //                             // .addSelect(["s.id","s.login", "s.avatar_url"])
        //                             .orderBy("f.create_date", "DESC")
        //                             .getMany();
        const friendships = await this.friendshipRepository
                                    .find({
                                        where:
                                        [
                                            {receiver: user, status: "accepted"},
                                            {sender: user, status: "accepted"}
                                        ],
                                        relations: ['sender', "receiver"],
                                        
                                        
                                    })
        return friendships;
    }

    public async removeFriendship(friendshipId: number, userId: number)
    {
        const friendship = await this.friendshipRepository
                                .createQueryBuilder("f")
                                .delete()
                                .from(FriendshipEntity)
                                .execute();
        console.log(friendship);
    }
}