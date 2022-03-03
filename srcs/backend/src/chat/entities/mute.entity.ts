import User from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";

@Entity()
export default class MutedList
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "timestamp", nullable: false})
    expireDate: Date;

    @ManyToOne(()=> User, user => user.mutedList, {onDelete: "CASCADE", nullable: false})
    mutedUser: User;

    @ManyToOne(()=> Channel, channel => channel.mutedList,{onDelete: "CASCADE",nullable: false})
    channel: Channel;

}