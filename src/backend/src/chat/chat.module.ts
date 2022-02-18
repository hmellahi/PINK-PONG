import { Module } from '@nestjs/common';
import { AuthModule } from 'src/authentication/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChannelsController } from './controllers/channels.controller';
import { TmpChatService } from './services/chat.service';

@Module({
    imports: [AuthModule],
    controllers : [ChannelsController],
    providers: [TmpChatService, ChatGateway]
})
export class ChatModule {}
