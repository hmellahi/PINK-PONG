import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authentication/auth.module';
import { ChatGateway } from './chat.gateway';
import ChannelEntity from './entities/channel.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';


@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ChannelEntity])
    ],
    controllers : [ChatController],
    providers: [ChatService, ChatGateway]
})
export class ChatModule { }
