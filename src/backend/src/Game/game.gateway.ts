import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {Logger, UseGuards} from '@nestjs/common';
import { Game } from './Interfaces/Game.interface';
import { HttpStatus, HttpException } from '@nestjs/common';
import {JwtAuthGuard} from "../authentication/Guards/jwtAccess.guard";

let MAX_SCORE = 5;

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthGuard)
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
    console.log(player);
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
    console.log(
      `%c client joined queue: ${player.id}`,
      'background: #222; color: #bada55',
    );
    // if (this.players.indexOf(this.username) != -1)
    this.players.push(player);

    if (this.players.length >= 2) {
      // console.log(this.players);
      const roomId = this.players[0].id + '' + this.players[1].id;

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

  checkBorders(canvas: any, ball: any): number {
    if (ball.x - ball.radius / 2 <= 0) return 2;
    if (ball.x + ball.radius / 2 >= canvas.width) return 1;
    return 0;
  }

  @SubscribeMessage('paddleMoves')
  handleMessages(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { paddle, roomId, userId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );

    // room doesnt exist
    if (!currentPlayerRoom) return 'roomNotFound';
    if (
      userId != currentPlayerRoom.player1 ||
      userId != currentPlayerRoom.player2
    )
      return 'u cant move the paddle hehe ;)';
    player.to(roomId).emit('paddleMoves', { paddle });
    console.log(`player emitting: ${paddle}`);
  }

  @SubscribeMessage('ballMoves')
  ballMoves(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    let { ball, canvas, roomId, userId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );

    // room doesnt exist
    if (!currentPlayerRoom)
      return this.server.to(player.id).emit('roomNotFound');
    if (userId != currentPlayerRoom.player1) return '';

    player.to(roomId).emit('ballMoves', { ball, canvas });
    console.log(`player emitting: ${ball}, ${canvas}`);
    const ballHitsBorder = this.checkBorders(canvas, ball);
    if (ballHitsBorder) {
      this.server.to(roomId).emit('incrementScore', ballHitsBorder);
      const roomIndex = this.liveGames.indexOf(currentPlayerRoom);
      if (ballHitsBorder == 1) {
        this.liveGames[roomIndex].score1++;
      } else {
        this.liveGames[roomIndex].score2++;
      }
      if (
        this.liveGames[roomIndex].score1 >= MAX_SCORE ||
        this.liveGames[roomIndex].score2 >= MAX_SCORE
      ) {
        // Inform everyone that game ends
        this.server.to(roomId).emit('gameOver');
        // TODO SAVE IN DATABASE
        this.removeGame(roomId);
      }
    }
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
      return "roomNotFound"
      // throw new WsException('Invalid credentials.');

      // return this.server.to(player.id).emit('roomNotFound');
    // return this.server.to(player.id).emit('roomNotFound');

    // update user status [inGame] TODO

    player.join(roomId);
    console.log(`player joined: ${player.id}`);
    return {
      player1: currentPlayerGame.player1,
      player2: currentPlayerGame.player2,
      isPlayer1: userId == currentPlayerGame.player1,
      isSpectator:
        userId != currentPlayerGame.player1 &&
        userId != currentPlayerGame.player2,
    } ;
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

    const roomIndex = this.liveGames.indexOf(currentPlayerRoom);
    console.log(roomIndex);
    if (currentPlayerRoom.player1 == userId) {
      this.liveGames[roomIndex].ff = 1;
    } else if (currentPlayerRoom.player1 == userId)
      this.liveGames[roomIndex].ff = 2;
    else return 'wtf';
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
    console.log(`client joined: ${client.id}`);
    // this.logger.log(`Client connected: ${client.id}`);
  }
}
