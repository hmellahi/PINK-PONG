import { Exclude } from "class-transformer";
import User from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany,
         ManyToOne,
         PrimaryGeneratedColumn
        }
        from "typeorm";

@Entity()
export default class Channel
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;

    @ManyToMany(()=> User, {nullable: false, onDelete:"CASCADE"})
    @JoinTable()
    participants: User[];

    @ManyToOne(()=> User, user => user.owendChannels, {onDelete: "SET NULL"})
    owner: User;

    @Column({nullable: false})
    type: string;

    @Column({nullable: false})
    name: string;

    @Column({default: false})
    isLocked: boolean;

    @Exclude()
    @Column({nullable:true})
    password: string;

}   