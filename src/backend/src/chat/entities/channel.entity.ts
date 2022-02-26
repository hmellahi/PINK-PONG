import User from "src/user/entities/user.entity";
import Message from "./message.entity";
import { Column, Entity, JoinTable, ManyToMany,
         ManyToOne,
         OneToMany,
         PrimaryGeneratedColumn
        }
        from "typeorm";
import MutedList from "./mute.entity";

@Entity()
export default class Channel
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;

    @ManyToMany(()=> User, {nullable: false, onDelete:"CASCADE"})
    @JoinTable()
    members: User[];

    @ManyToMany(()=> User, {nullable: false, onDelete:"CASCADE"})
    @JoinTable()
    admins: User[];

    @ManyToMany(()=> User, {onDelete:"CASCADE"})
    @JoinTable()
    bandedUsers: User[];

    @ManyToOne(()=> User, user => user.owendChannels, {onDelete: "SET NULL"})
    owner: User;

    @OneToMany(()=> Message, message => message.channel)
    messages: Message[];

    @Column({nullable: false})
    type: string;

    @Column({nullable: false})
    name: string;

    @Column({default: false})
    isLocked: boolean;

    @Column({nullable:true})
    password: string;

    @OneToMany(()=> MutedList, mutedList => mutedList.mutedUser)
    mutedList: MutedList[];
}   