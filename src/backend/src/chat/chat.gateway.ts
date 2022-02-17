import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/authentication/auth.service';
import { ChatService } from './chat.service';



@WebSocketGateway({
    namespace: 'chat',
    cors: {
        origin: 'http://127.0.0.1:5000',
        credentials: true,
    },
})
export class ChatGateway {
    @WebSocketServer() server: Server;

    constructor(private authService: AuthService, private chatService: ChatService) { }

    async handleConnection(client: any) {
        const authentication = await this.authService.getUserFromSocket(client);
        if (!authentication) {
            client.disconnect();
            return;
        }
        client.userId = authentication.id;
        console.log(`client connected: ${client.id}`);
    }


    handleDisconnect(client: any) {
        console.log(`client disconnected: ${client.id}`);
    }

    @SubscribeMessage('channels')
    getChannels(@MessageBody() data: any, @ConnectedSocket() client: any) {
        console.log(data);
    }

}
