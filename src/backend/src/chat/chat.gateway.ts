import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/authentication/auth.service';
import { ChatService } from './chat.service';
import { MessageDto } from './dtos/message.dto';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://127.0.0.1:5000',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: any) {
    const authentication = await this.authService.getUserFromSocket(client);
    if (!authentication) {
      client.disconnect();
      return;
    }
    // join client to all his rooms
    client.userId = authentication.id;
    console.log(`chat client connected: ${client.id}`);
    this.server.emit('channels', await this.chatService.getChannels(authentication));
  }

  handleDisconnect(client: any) {
    console.log(`chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: MessageDto) {
    console.log(data);
  }
}
