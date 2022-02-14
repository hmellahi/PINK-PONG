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

let MAX_SCORE = 5;

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
  username: string = '';
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('leaveQueue')
  leaveQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket,
  ) {
    // this.logger.log(`client leaved queue: ${client.id}`);
    this.players = this.players.filter(
      (playerinQueue) => playerinQueue.id != player.id,
    );
    console.log(`client leaved queue: ${player.id}`);
  }

  @SubscribeMessage('joinQueue')
  joinQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket,
  ): void {
    // TODO CHECK FOR USERID
    // if (this.players.indexOf(this.username) != -1)
    console.log(
      `%c client joined queue: ${player.id}`,
      'background: #222; color: #bada55',
    );
    this.players.push(player);

    if (this.players.length >= 2) {
      // console.log(this.players);
      const roomId = this.players[0].id + '' + this.players[1].id;
      // join room
      // this.players[0].join(roomId);
      // this.players[1].join(roomId);

      // register the game
      this.liveGames.push({
        roomId,
        player1: userId, // TODO CHANGE
        player2: userId, // TODO CHANGE
        score1: 0,
        score2: 0,
        created_at: new Date(),
        map: 0, // TODO CHANGE
        ff: 0,
      });

      // alert players
      this.server
        .to(this.players[0].id)
        .to(this.players[1].id)
        .emit('matchFound', roomId);

      // remove playes from queue
      this.players.splice(0, 2);
    }
    // console.log(this.players);
    // return 'Hello world!';
  }

  @SubscribeMessage('paddleMoves')
  handleMessages(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { paddle, roomId, userId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    // console.table(this.liveGames);
    // console.table(this.liveGames);
    // console.table(currentPlayerRoom);
    // room doesnt exist
    if (!currentPlayerRoom)
      return this.server.to(player.id).emit('roomNotFound');

    // player.to(roomId).emit('paddleMoves', { players:[{'velocity':velocity, ''}]});
    player.to(roomId).emit('paddleMoves', { paddle });
    console.log(`player emitting: ${paddle}`);

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

    // update user status [inGame] TODO
    // check if player/spectator
    player.join(roomId);
    // this.server.to(player.id).emit('gameloads', {
    //   players: [
    //     { username: '', avatar: '' },
    //     { username: '', avatar: '' },
    //   ],
    // });
    console.log(`player joined: ${player.id}`);
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    this.logger.log(`aafk: ${player.id}`);
    const { roomId, userId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    // const currentPlayerRoom = this.liveGames.indexOf()
    // room doesnt exist
    if (!currentPlayerRoom)
      // return this.server.to(player.id).emit('roomNotFound');
      return 'roomNotFound';

    // if (
    //   currentPlayerRoom.player1 != userId &&
    //   currentPlayerRoom.player2 != userId
    // )
    //   return 'wtf';
    const roomIndex = this.liveGames.indexOf(currentPlayerRoom);
    console.log(roomIndex);
    if (currentPlayerRoom.player1 == userId) {
      this.liveGames[roomIndex].ff = 1;
    } else this.liveGames[roomIndex].ff = 2;

    // TODO SAVE IN DATABASE
    // Inform everyone that game ends
    this.server.to(roomId).emit('gameOver');
    this.removeGame(roomId);
  }

  removeGame(roomId: string) {
    this.liveGames = this.liveGames.filter((game) => game.roomId === roomId);
  }

  @SubscribeMessage('getLiveGames')
  getLiveGames(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    return this.liveGames;
  }

  @SubscribeMessage('incrementScore')
  incrementScore(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { roomId } = data;
    let userId = 1;
    // return this.liveGames;
    // this.liveGames[roomId][userId].score;
    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );

    if (currentPlayerRoom.player1 == userId) this.liveGames[roomId].score1++;
    else if (currentPlayerRoom.player2 == userId)
      this.liveGames[roomId].score2++;

    // CHECK IF GAME IS OVER
    if (
      this.liveGames[roomId].score2 >= MAX_SCORE ||
      this.liveGames[roomId].score1 >= MAX_SCORE
    ) {
      this.liveGames = this.liveGames.filter((game) => game.roomId === roomId);
      // SAVE IN DATABASE
    }
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    // this.logger.log(`client leaved queue: ${client.id}`);
    // this.players = this.players.filter((player) => player.id === client.id);
    console.log(`client leaved queue: ${client.id}`);
    // if player was in queue?
    // quit the game
    // if player was in game
    // end game with lost to the player
    // this.leaveGame({roomId}, client )
    // else
    // do nting
  }
  handleConnection(client: Socket, ...args: any[]) {
    // console.log(`client joined: ${client.id}`);
    // this.logger.log(`Client connected: ${client.id}`);
  }
}
