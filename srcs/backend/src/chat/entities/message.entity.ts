import User from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";
@Entity()

export default class Message
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: false})
    msg: string;

    @ManyToOne(()=> User, user => user.messages)
    owner: User;

    @ManyToOne(()=> Channel, channel => channel.messages)
    channel: Channel;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;
}
