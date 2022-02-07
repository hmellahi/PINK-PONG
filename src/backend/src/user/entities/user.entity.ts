import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import  Friendship from "src/friend/entities/friendship.enitity"

@Entity()
export default class  User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true})
    login?: string;

    @Column({nullable: true, select: false})
    password: string;
    
    @Column({unique: true})
    email: string;

    // refresh token
    @Column({nullable: true})
    currentRefreshToken?: string;


    @Column({default: false})
    two_factor_auth_enabled: boolean;

    @Column({nullable: true})
    two_factor_auth_code: string;

    @Column({nullable: true})
    avatar_url: string;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    create_date: Date;

    @OneToMany(()=> Friendship, friendRequest => friendRequest.sender)
    sendedFriendRequests: Friendship[];

    @OneToMany(()=> Friendship, friendRequest => friendRequest.receiver)
    receivedFriendRequests: Friendship[];

}