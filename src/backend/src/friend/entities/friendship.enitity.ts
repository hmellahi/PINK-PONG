import User from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendshipStatus } from "../Interfaces/friendship.interface";

@Entity()
export default class Friendship
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User , user => user.sendedFriendRequests)
    sender: User;
    
    @ManyToOne(()=> User , user=> user.receivedFriendRequests)
    receiver  : User;

    @Column({default: "pending"})
    status: FriendshipStatus;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;
}