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
import {
  DmMessageDto,
  GetDmMessagesDto,
  GetMessagesDto,
  MessageDto,
} from './dtos/message.dto';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: `http://192.168.99.100:5000`,
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  async handleConnection(client: any | Socket) {
    const authentication = await this.authService.getUserFromSocket(client);
    if (!authentication) {
      client.disconnect();
      return;
    }

    client.user = authentication;
    // console.log(`chat client connected: ${client.id}`);

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
    //console.log(`chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('allMessages')
  async getAllMessages(client: Socket | any, data: GetMessagesDto) {
    if (!client.user) return { err: true, msg: 'socket not found!' };

    try {
      // get all messages for specific room
      let messages = await this.chatService.getAllMessages(client.user, data);
      // join user to room
      client.join(data.channelId.toString());
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

      let sockets = await this.server.fetchSockets();

      let exceptList = [];

      // get list of users blocking me
      let blockingList = await this.getBlockingList(sockets, client);
      exceptList = exceptList.concat(blockingList);

      // uncomment this if you want to stop both users from seing eachothers msgs
      /* get list of users i am blocking */
      // let blockedList = await this.getBlockedList(client.user, sockets);
      // exceptList = exceptList.concat(blockedList);

      //console.log('final list:   ' + exceptList.length);

      // send message to specific room
      client.to(data.channelId.toString()).except(exceptList).emit('message', {
        err: false,
        msg: data.msg,
        owner: client.user,
        channelId: data.channelId,
      });
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

  async getBlockedList(user: any, sockets: any) {
    let blockedList = [];
    let users = [];
    let tmp = await this.userService.getBlockedList(user);
    for (let i = 0; i < tmp.length; i++) {
      users.push(tmp[i].user.id);
    }

    for (let j = 0; j < users.length; j++) {
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].user.id == users[j]) {
          blockedList.push(sockets[i].id);
          break;
        }
      }
    }
    return blockedList;
  }

  async getBlockingList(sockets: any, client: Socket | any) {
    let blockingList = [];

    for (let i = 0; i < sockets.length; i++) {
      // check if any server socket is blocking me
      let isBlocked = await this.userService.isBlockedUser(
        sockets[i].user,
        client.user,
      );
      if (isBlocked) {
        blockingList.push(sockets[i].id);
      }
    }
    return blockingList;
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
    const action: string = data.isPermanant ? 'banned' : 'kicked';
    if (!client.user) return { err: true, msg: 'socket not found!' };
    try {
      await this.chatService.ban_Kick_Member(client.user, data);
      client.to(data.channelId.toString()).emit('banUser', {
        err: false,
        msg: {
          userId: data.userId,
          channelId: data.channelId,
          msg: `You have been ${action}!`,
          isPermanant: data.isPermanant,
        },
      });
      client.leave(data.channelId.toString());
      return { err: false, msg: `user has been ${action}!` };
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

  @SubscribeMessage('getDmsMessages')
  async getDmsMessages(client: Socket | any, data: GetDmMessagesDto) {
    if (!client.user) return { err: true, msg: 'socket not found!' };
    try {
      let msgs = await this.chatService.getDmsMessages(client.user, data);
      return { err: false, msg: msgs };
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }

  @SubscribeMessage('messageDm')
  async messageDmBroadcast(client: Socket | any, data: DmMessageDto) {
    //console.log({ data });

    if (!client.user) return { err: true, msg: 'socket not found!' };
    try {
      let sockets: any = await this.server.fetchSockets();

      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].user.id == data.userId) {
          let isBlocked = await this.userService.isBlockedUser(
            sockets[i].user,
            client.user,
          );
          if (isBlocked) {
            return { err: true, msg: "You're blocked!" };
          }
          break;
        }
      }

      await this.chatService.createDmMessage(client.user, data);
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].user.id == data.userId) {
          client.to(sockets[i].id).emit('messageDm', {
            err: false,
            msg: data.msg,
            owner: client.user,
          });
        }
      }
    } catch (e) {
      return { err: true, msg: e.message };
    }
  }
}
