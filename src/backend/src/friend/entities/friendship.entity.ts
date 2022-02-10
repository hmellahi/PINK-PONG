import User from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { FriendshipStatus, Friendship_Status } from "../Interfaces/friendship.interface";

@Entity()
@Unique("sender_recevier_constraint", ["receiver", "sender"])
export default class Friendship
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User , user => user.sendedFriendRequests, {onDelete: "CASCADE"})
    sender: User;
    
    @ManyToOne(()=> User , user=> user.receivedFriendRequests, {onDelete: "CASCADE"})
    receiver  : User;

    @Column({default: "pending"})
    status: Friendship_Status;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;
}