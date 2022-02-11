import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Game } from './Interfaces/Game.interface';
import { HttpStatus, HttpException } from '@nestjs/common';

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
  liveGames: Game[] = [];
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('leaveQueue')
  leaveQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket,
  ) {
    // this.logger.log(`client leaved queue: ${client.id}`);
    this.players = this.players.filter((player) => player.id === player.id);
    // console.log(`client leaved queue: ${player.id}`);
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
    // if (this.players.indexOfx(playerId) != -1)
    this.players.push(player);

    if (this.players.length >= 2) {
      // console.log(this.players);
      let roomId = this.players[0].id + '' + this.players[1].id;
      // join room
      this.players[0].join(roomId);
      this.players[1].join(roomId);

      // register the game
      this.liveGames.push({
        player1: this.players[0],
        player2: this.players[1],
        roomId,
      });

      //
      this.server.to(roomId).emit('matchFound', roomId);

      // update user status [inGame] TODO

      // // remove playes from queue
      this.players.splice(0, 2);
    }
    // console.log(this.players);
    return 'Hello world!';
  }

  @SubscribeMessage('paddleMoves')
  handleMessages(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { velocity, roomId, userId } = data;

    // if (player)
    // player.emit()
    // let currentPlayerRoom = player.rooms[0].id;
    // if (liveGames.indexOf())
    // console.log(data)
    let currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    console.table(this.liveGames);
    console.table(this.liveGames);
    console.table(currentPlayerRoom);
    // room doesnt exist
    if (!currentPlayerRoom)
      return this.server.to(player.id).emit('roomNotFound');
    // throw new HttpException(
    //   {
    //     status: HttpStatus.BAD_REQUEST,
    //     error: 'room not found',
    //   },
    //   HttpStatus.BAD_REQUEST,
    // );

    // if () 
    console.log(data, player.rooms);
    // player.join();
    // player.join(room)
    player.to(roomId).emit('paddleMoves', velocity);
    // console.log(`client joined: ${velocity}`);

    // this.server.to(spectactoRoom).emit()
  }

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { roomId, userId } = data;

    let currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    console.table(this.liveGames);
    console.table(currentPlayerRoom);
    // room doesnt exist
    if (!currentPlayerRoom)
      return this.server.to(player.id).emit('roomNotFound');
    player.join(roomId)
  }

  // handleDisconnect(client: Socket, ...args: any[]) {
  //   // this.logger.log(`client leaved queue: ${client.id}`);
  //   this.players = this.players.filter((player) => player.id === client.id);
  //   console.log(`client leaved queue: ${client.id}`);
  // }
  handleConnection(client: Socket, ...args: any[]) {
    // console.log(`client joined: ${client.id}`);
    // this.logger.log(`Client connected: ${client.id}`);
  }
}
