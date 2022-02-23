import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/authentication/auth.service';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { ChatService } from './chat.service';
import { AddAdminDto, BanUserDto } from './dtos/channel.dto';
import { GetMessagesDto, MessageDto } from './dtos/message.dto';

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

  async handleConnection(client: any | Socket) {
    const authentication = await this.authService.getUserFromSocket(client);
    if (!authentication) {
      client.disconnect();
      return;
    }

    client.user = authentication;
    console.log(`chat client connected: ${client.id}`);

    // join client to all his rooms
    try {
      let myChannels = await this.chatService.getMyChannels(authentication);
      console.log(myChannels[0].id);
      myChannels.forEach(function (channel) {
        client.join(channel.id.toString());
      });
    } catch (e) {
      return { err: true, msg: e.message };
    }
    this.server.to(client.id).emit('ready');
  }

  handleDisconnect(client: any) {
    console.log(`chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('allMessages')
  async getAllMessages(client: Socket | any, data: GetMessagesDto) {
    if (!client.user) return { err: true, msg: 'socket not found!' };

    try {
      // get all messages for specific room
      let messages = await this.chatService.getAllMessages(client.user, data);

      console.log(messages);

      // join user to room
      client.join(data.channelId.toString());
      console.log({ id: client.id });

      return { err: false, msg: messages };
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

  @SubscribeMessage('message')
  async messageBroadcast(client: Socket | any, data: MessageDto) {
    if (!client.user) return { err: true, msg: 'socket not found!' };

    try {
      // save on database
      await this.chatService.createMessage(client.user, data);
      // send message to specific room
      client.to(data.channelId.toString()).emit('message', {
        err: false,
        msg: data.msg,
        owner: client.user,
        channelId: data.channelId,
      });
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

  @SubscribeMessage('addAdmin')
  async addAdmin(client: Socket | any, data: AddAdminDto) {
    if (!client.user) return { err: true, msg: 'socket not found!' };
    try {
      await this.chatService.addAdmin(client.user, data);

      client.to(data.channelId.toString()).emit('addAdmin', {
        err: false,
        msg: {
          userId: data.userId,
          channelId: data.channelId,
          msg: 'you have been granted admin privilege!',
        },
      });
      return { err: false, msg: 'user is admin' };
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

  @SubscribeMessage('banUser')
  async banUser(client: Socket | any, data: BanUserDto) {
    if (!client.user) return { err: true, msg: 'socket not found!' };
    try {
      // await this.chatService.banUser(client.user, data);

      client.to(data.channelId.toString()).emit('banUser', {
        err: false,
        msg: {
          userId: data.userId,
          channelId: data.channelId,
          msg: 'You have been banned!',
        },
      });
      
      if (data.isPermanant) client.leave(data.channelId.toString());

      return { err: false, msg: 'user has been banned!' };
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

}
