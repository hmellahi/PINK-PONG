import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/authentication/auth.service';
import { TmpChatService } from './services/chat.service';



@WebSocketGateway({
    namespace: 'chat',
    cors: {
        origin: 'http://127.0.0.1:5000',
        credentials: true,
    },
})
export class ChatGateway {
    @WebSocketServer() server: Server;

    constructor(private authService: AuthService, private chatService: TmpChatService) { }

    async handleConnection(client: any) {
        const authentication = await this.authService.getUserFromSocket(client);
        if (!authentication) {
            client.disconnect();
            return;
        }
        client.userId = authentication.id;
        console.log(`chat client connected: ${client.id}`);
        this.server.emit('channels', this.chatService.getChannels());
    }


    handleDisconnect(client: any) {
        console.log(`chat client disconnected: ${client.id}`);
    }
}
