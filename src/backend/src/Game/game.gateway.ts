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
  username:string = "";
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
  ): void {
    // let roomId = 'game' + this.roomId++;
    // this.usersInQueue.push(userId);
    // let playerId = getuser().id;

    // TODO CHECK FOR USERID
    // if (this.players.indexOf(this.username) != -1)
      this.players.push(player);

    if (this.players.length >= 2) {
      // console.log(this.players);
      const roomId = this.players[0].id + '' + this.players[1].id;
      // join room
      this.players[0].join(roomId);
      this.players[1].join(roomId);

      // register the game
      this.liveGames.push({
        player1: this.username,
        player2: this.username,
        roomId,
      });

      //
      this.server.to(roomId).emit('matchFound', roomId);

      // update user status [inGame] TODO

      // // remove playes from queue
      this.players.splice(0, 2);
    }
    // console.log(this.players);
    // return 'Hello world!';
  }

  @SubscribeMessage('paddleMoves')
  handleMessages(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { velocity, roomId, userId } = data;

    // if (player)
    // player.emit()
    // let currentPlayerRoom = player.rooms[0].id;
    // if (liveGames.indexOf())
    // console.log(data)
    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    // console.table(this.liveGames);
    // console.table(this.liveGames);
    // console.table(currentPlayerRoom);
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
    // console.log(data, player.rooms);
    // player.join();
    // player.join(room)
    // player.to(roomId).emit('paddleMoves', { players:[{'velocity':velocity, ''}]});
    player.to(roomId).emit('paddleMoves', velocity);
    console.log(`player emitting: ${velocity}`);

    // this.server.to(spectactoRoom).emit()
  }

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    const { roomId, userId } = data;

    const currentPlayerGame: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
   // console.table(this.liveGames);
    //console.table(currentPlayerRoom);
    // room doesnt exist
    if (!currentPlayerGame)
      return this.server.to(player.id).emit('roomNotFound');

    // check if player/spectator
    player.join(roomId);
    this.server.to(player.id).emit('gameloads', { players:[{username:'', avatar:''},{username:'', avatar:''}]});
    console.log(`player joined: ${player.id}`);


  }


  @SubscribeMessage('leaveGame')
  leaveGame(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    const { roomId, userId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
        (game) => game.roomId === roomId,
    );
    //console.table(this.liveGames);
   // console.table(currentPlayerRoom);
    this.logger.log(`player joined: ${player.id}`);

    // room doesnt exist
    if (!currentPlayerRoom)
      return this.server.to(player.id).emit('roomNotFound');
    player.join(roomId);
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