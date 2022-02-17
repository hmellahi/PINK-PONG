import { Module } from '@nestjs/common';
import { AuthModule } from 'src/authentication/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
    imports: [AuthModule],
    providers: [ChatService, ChatGateway]
})
export class ChatModule {}
