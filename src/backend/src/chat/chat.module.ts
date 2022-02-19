import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authentication/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChannelsController } from './controllers/channels.controller';
import { ChannelPostEntity } from './entities/channel.entity';
import { TmpChatService } from './services/chat.service';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([ChannelPostEntity])],
    controllers: [ChannelsController],
    providers: [TmpChatService, ChatGateway]
})
export class ChatModule { }
