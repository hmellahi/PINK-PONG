import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer() server: Server;

  // usersInQueue: number[] = [];
  players: any[] = [];
  roomId: number = 0;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('leaveQueue')
  leaveQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket, 
  ) {
    // this.logger.log(`client leaved queue: ${client.id}`);
    this.players = this.players.filter((player) => player.id === player.id);
    console.log(`client leaved queue: ${player.id}`);
  }

  @SubscribeMessage('joinQueue')
  joinQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket,
  ): string {
    // let roomId = 'game' + this.roomId++;
    // this.usersInQueue.push(userId);
    // let playerId = getuser().id;

    // TODO CHECK FOR USERID
    // if (this.players.indexOf(playerId) != -1)
    this.players.push(player);
    // console.log(this.players.length);

    if (this.players.length >= 2) {
      // console.log(this.players);
      let roomId = this.players[0].id + '#' + this.players[1].id;
      // join room
      this.players[0].join(roomId);
      this.players[1].join(roomId);
      // console.log(this.players.length);

      //
      this.server.to(roomId).emit('matchFound', roomId);

      // update user status

      // 

      // // remove playes from queue
      this.players.splice(0, 2);
      // console.log(this.players.length);
    }
    // console.log(this.players);
    return 'Hello world!';
  }

  @SubscribeMessage('paddleMoves')
  handleMessages(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { direction } = data;

    // if (player)
    // player.emit()
    let currentPlayerRoom = player.rooms[0].id;

    player.to(currentPlayerRoom).emit('paddleMoves', direction);

    // this.server.to(spectactoRoom).emit()
  }

  // @SubscribeMessage('spectact')
  // handleMessagesd(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() player: Socket,
  // ) {
  //   let {direction} = data;

  //   // if (player)
  //   // player.emit()
  //   let currentPlayerRoom = player.rooms[0].id;

  //   player.to(currentPlayerRoom).emit("paddleMoves", direction)
  // }

  // handleDisconnect(client: Socket, ...args: any[]) {
  //   // this.logger.log(`client leaved queue: ${client.id}`);
  //   this.players = this.players.filter((player) => player.id === client.id);
  //   console.log(`client leaved queue: ${client.id}`);
  // }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`client joined: ${client.id}`);
    // this.logger.log(`Client connected: ${client.id}`);
  }
}
