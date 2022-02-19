import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('chat_channels')
export class ChannelPostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    type: string;

    @Column({ default: '' })
    name: string;

    @Column({ default: false })
    isLocked: boolean;

    @Column({ default: 1 })
    participentsCount: number;

    @CreateDateColumn()
    createdAt: Date;

}