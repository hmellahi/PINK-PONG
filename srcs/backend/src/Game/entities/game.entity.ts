import User from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export default class Game
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, user=> user.first, {onDelete: "CASCADE"})
    first_user: User;

    @ManyToOne(()=> User, user=> user.second, {onDelete: "CASCADE"})
    second_user: User;
    
    @Column()
    first_user_score: number;

    @Column()
    second_user_score: number;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    create_date: Date;

    @Column()
    flag: number;

    @Column()
    map: number;
}