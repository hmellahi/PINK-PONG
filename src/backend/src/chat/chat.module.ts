import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authentication/auth.module';
import { ChatGateway } from './chat.gateway';
import ChannelEntity from './entities/channel.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from 'src/user/user.module';
import MessageEntity from './entities/message.entity';
import MutedListEntity from './entities/mute.entity';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([ChannelEntity, MessageEntity, MutedListEntity]),
    UserModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
