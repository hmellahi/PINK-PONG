import User from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany,
         OneToOne, PrimaryGeneratedColumn
        }
        from "typeorm";

@Entity()
export default class Channel
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;

    @ManyToMany(()=> User)
    @JoinTable()
    participants: User[];

    @OneToOne(()=> User)
    owner: User;
}   