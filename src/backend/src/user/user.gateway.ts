import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { NestMiddleware } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/Guards/jwtAccess.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/authentication/auth.service';
import User from './entities/user.entity';

@WebSocketGateway({
  namespace: 'user',
  cors: {
    origin: 'http://127.0.0.1:5000',
    credentials: true, // todo useless?
  },
})
export class UserGateway {
  users: any[] = [];
  @WebSocketServer() server: Server;

  constructor(private authService: AuthService) {}

  handleDisconnect(client: Socket | any, ...args: any[]) {
    delete this.users[client.userId];
  }

  async handleConnection(client: any, ...args: any[]) {
    const user = await this.authService.getUserFromSocket(client);
    if (!user) {
      //console.log("imposter")
      client.disconnect();
      return;
    }
    client.userId = user.id;
    this.users[user.id] = {
      status: 'online',
      socket: client,
    };
  }
}
