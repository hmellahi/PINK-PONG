import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Friendship from 'src/friend/entities/friendship.entity';
import BlockList from './blockedUserList.entity';
import Game from 'src/Game/entities/game.entity';
import Channel from 'src/chat/entities/channel.entity';
import Message from 'src/chat/entities/message.entity';
import MutedList from 'src/chat/entities/mute.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Index()
  @Column({ unique: true })
  login: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  // refresh token
  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column({ default: false })
  two_factor_auth_enabled: boolean;

  @Column({ nullable: true })
  two_factor_auth_code: string;

  @Column({ nullable: false })
  image_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  //=====
  @OneToMany(() => Friendship, (friendRequest) => friendRequest.sender)
  sendedFriendRequests: Friendship[];

  @OneToMany(() => Friendship, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: Friendship[];

  @OneToMany(() => Game, (game) => game.first_user)
  first: Game[];

  @OneToMany(() => Game, (game) => game.second_user)
  second: Game[];

  //=====
  @OneToMany(() => BlockList, (blockList) => blockList.blocker)
  blockedUsersList: BlockList[];

  @OneToMany(() => BlockList, (blockList) => blockList.blocked)
  blockedByUserList: BlockList[];

  @OneToMany(() => Channel, (channel) => channel.owner)
  owendChannels: Channel[];

  @OneToMany(() => Message, (message) => message.owner)
  messages: Message[];

  @OneToMany(() => MutedList, (mutedList) => mutedList.channel)
  mutedList: MutedList[];
}
