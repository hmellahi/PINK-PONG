import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/authentication/auth.service';
import { UserService } from 'src/user/user.service';
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
    private userService: UserService
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
      // join user to room
      client.join(data.channelId.toString());
      console.log(messages)
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
      // check if the user is blocked before sending
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

    const action: string = (data.isPermanant) ? "banned": "kicked";
    if (!client.user) return { err: true, msg: 'socket not found!' };
    try {
      await this.chatService.ban_Kick_Member(client.user, data)
      client.to(data.channelId.toString()).emit('banUser', {
        err: false,
        msg: {
          userId: data.userId,
          channelId: data.channelId,
          msg: `You have been ${action}!`,
          isPermanant: data.isPermanant,
        },
      });

      // if (data.isPermanant) 
      client.leave(data.channelId.toString());

      return { err: false, msg: `user has been ${action}!` };
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }
}
