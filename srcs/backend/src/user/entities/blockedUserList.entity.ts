import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()

export default class BlockList
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User , user => user.blockedUsersList, {onDelete: "CASCADE"})
    blocker: User;

    @ManyToOne(()=> User, user => user.blockedByUserList, {onDelete: "CASCADE"})
    blocked: User;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;
}