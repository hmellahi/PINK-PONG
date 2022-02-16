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
import { Game, Ball, Paddle } from './Interfaces/Game.interface';
import { HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/Guards/jwtAccess.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/authentication/auth.service';

let MAX_SCORE = 5;

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: 'http://127.0.0.1:5000',
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer() server: Server;

  constructor(private authService: AuthService) {}
  // usersInQueue: number[] = [];
  players: any[] = [];
  pendingRequests: any = {};
  liveGames: Game[] = [];
  username: string = '';
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('leaveQueue')
  leaveQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket,
  ) {
    // this.logger.log(`client leaved queue: ${client.id}`);
    // console.log(player);
    this.players = this.players.filter(
      (playerinQueue) => playerinQueue.id != player.id,
    );
    // TODO UPDATE USER STATUS
    console.log(`client leaved queue: ${player.id}`);
  }

  @SubscribeMessage('joinQueue')
  joinQueue(
    @MessageBody() data: any,
    @ConnectedSocket() player: Socket | any,
  ): string {
    let { map } = data;

    // TODO CHECK FOR USER STAUS
    // TODO UPDATE USER STATUS
    if (this.players.find((p) => p.userId === player.userId))
      return 'u cant join queue asshole';
    const secondPlayer = this.players.find((player) => player.map == map);

    if (!secondPlayer) {
      this.players.push({ socket: player, map, userId: player.userId });
      return;
    }
    // console.log(map, map);

    const roomId = this.createGame(
      player.userId,
      secondPlayer.userId,
      player.id,
      secondPlayer.socket.id,
      map,
    );

    // alert players
    this.server
      .to(secondPlayer.socket.id)
      .to(player.id)
      .emit('matchFound', roomId);

    // TODO UPDATE USER STATUS
    // remove player from queue
    this.players.splice(this.players.indexOf(secondPlayer), 1);
  }

  checkBorders(canvas: any, ball: any): number {
    if (ball.x - ball.radius / 2 <= 0) return 2;
    if (ball.x + ball.radius / 2 >= canvas.width) return 1;
    return 0;
  }

  @SubscribeMessage('paddleMoves')
  handleMessages(
    @MessageBody() data: any,
    @ConnectedSocket() player: Socket | any,
  ) {
    let { paddle, roomId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );

    // room doesnt exist
    if (!currentPlayerRoom) return 'roomNotFound';
    if (
      player.userId != currentPlayerRoom.player1 &&
      player.userId != currentPlayerRoom.player2
    )
      return 'u cant move the paddle hehe ;)';

    let isPlayer1: number = player.userId == currentPlayerRoom.player1 ? 1 : 0;
    this.liveGames[this.liveGames.indexOf(currentPlayerRoom)].paddles[
      isPlayer1 ? 0 : 1
    ] = paddle;
    player.to(roomId).emit('paddleMoves', {
      paddle,
      isPlayer1,
      canvas: currentPlayerRoom.canvas,
    });
    // console.log("emitting paddle Pos");
  }

  @SubscribeMessage('ballMoves')
  ballMoves(@MessageBody() data: any, @ConnectedSocket() player: Socket | any) {
    let { ball, canvas, roomId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );

    // room doesnt exist
    if (!currentPlayerRoom)
      return this.server.to(player.id).emit('roomNotFound');
    const isPlayer1 = player.userId == currentPlayerRoom.player1;
    if (!isPlayer1) return '';
    this.liveGames[this.liveGames.indexOf(currentPlayerRoom)].canvas = canvas;
    this.liveGames[this.liveGames.indexOf(currentPlayerRoom)].ball = ball;
    player.to(roomId).emit('ballMoves', { ball, canvas });
    // console.log(`player emitting: ${ball}, ${canvas}`);
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
        this.server.to(roomId).emit('gameOver', ballHitsBorder);
        // TODO SAVE IN DATABASE
        this.removeGame(roomId);
      }
    }
  }

  @SubscribeMessage('inviteToGame')
  inviteToGame(@MessageBody() data: any, @ConnectedSocket() sender: Socket|any) {
    let { receiver } = data;
    if (sender.userId == receiver)
      return {err:true, msg:"u cant invite ur self hehe"}
    // TODO Check if sender status= online
    if (false)
      return {err:true, msg:"this user is already in game,, sorry"}
    if (false) return {err:true, msg:'you are already in game, you cant invite people'}
    this.pendingRequests[receiver].push(sender.id);
    sender.to(receiver).emit('inviteToGame');
  }

  @SubscribeMessage('declineInvitation')
  declineInvitation(
    @MessageBody() senderId: number,
    @ConnectedSocket() receiver: Socket | any,
  ) {
    this.removePendingRequest(receiver.userId, senderId);
  }

  removePendingRequest(recieverId: number, senderId: number) {
    let oldSize = this.pendingRequests[recieverId].length;
    this.pendingRequests[recieverId] = this.pendingRequests[recieverId].filter(
      (sender) => sender != senderId,
    );
    if (oldSize == this.pendingRequests[recieverId].length) return false;
    return true;
  }

  @SubscribeMessage('acceptInvitation')
  acceptInvitation(
    @MessageBody() senderSocketId: any,
    @ConnectedSocket() receiver: Socket | any,
  ) {
    // TODO Check if sender status= online
    if (false) return {err:true, msg:"this sender isnt online, can't accept invitation, sorry"};

    // remove senderId from pending requests
    if (!this.removePendingRequest(receiver.userId, senderSocketId))
      return {err:true, msg:'the invitation is no longer available'};
    if (this.pendingRequests[receiver.userId].length == 0)
      this.pendingRequests.delete(receiver.userId);
    // create game
    const roomId = this.createGame(1, 1, receiver.id, senderSocketId, 1); // TODO CHANGE
    this.server
      .to(receiver.id)
      .to(senderSocketId)
      .emit('customGameStarted', roomId);
  }

  createGame(
    player1ID: number,
    player2ID: number,
    player1SockerId: string,
    player2SockerId: string,
    map: number,
  ) {
    const roomId = player1SockerId + player2SockerId;
    this.liveGames.push({
      roomId,
      player1: player1ID,
      player2: player2ID,
      score1: 0,
      score2: 0,
      created_at: new Date(),
      ball: { x: 0, y: 0 },
      paddles: [
        { velocity: 0, y: 0 },
        { velocity: 0, y: 0 },
      ],
      map,
      ff: 0,
      canvas: { width: 0, height: 0 },
    });
    return roomId;
  }

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() data: any, @ConnectedSocket() player: Socket | any) {
    const { roomId } = data;

    // TODO CHECK USER STATUS
    const currentGameState: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    // room doesnt exist
    if (!currentGameState) return 'roomNotFound';
    // update user status [inGame] TODO

    player.join(roomId);
    let isSpectator =
      player.userId != currentGameState.player1 &&
      player.userId != currentGameState.player2;
    // console.log()
    //console.log(player.userId, currentGameState.player1, currentGameState.player2, isSpectator);

    let gameData = {
      player1: currentGameState.player1,
      player2: currentGameState.player2,
      isPlayer1: player.userId == currentGameState.player1,
      map: currentGameState.map,
      isSpectator,
    };
    //console.log("initial score", currentGameState.score1, currentGameState.score2)
    return { gameData, currentGameState };
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@MessageBody() data: any, @ConnectedSocket() player: Socket | any) {
    const { roomId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    // const currentPlayerRoom = this.liveGames.indexOf()
    // room doesnt exist
    if (!currentPlayerRoom)
      // return this.server.to(player.id).emit('roomNotFound');
      return 'roomNotFound';

    const roomIndex = this.liveGames.indexOf(currentPlayerRoom);
    //console.log(roomIndex);
    let ff;
    if (currentPlayerRoom.player1 == player.userId) {
      ff = 1;
    } else if (currentPlayerRoom.player1 == player.userId) ff = 2;
    else return 'wtf';
    // TODO SAVE IN DATABASE

    // Inform everyone that game ends
    this.server.to(roomId).emit('gameOver', ff);
    this.removeGame(roomId);
  }

  removeGame(roomId: string) {
    //console.log("before", this.liveGames, roomId)
    this.liveGames = this.liveGames.filter(
      (game: Game) => game.roomId != roomId,
    );
    //console.log("after", this.liveGames, roomId)
  }

  @SubscribeMessage('getLiveGames')
  getLiveGames(
    @MessageBody() data: any,
    @ConnectedSocket() player: Socket | any,
  ) {
    console.table(this.liveGames);
    return this.liveGames;
  }

  handleDisconnect(player: Socket | any, ...args: any[]) {
    if (false) return;
    // this.logger.log(`client leaved queue: ${client.id}`);
    // this.players = this.players.filter((player) => player.id === client.id);
    console.log(`client disconnected: ${player.id}`);
    // TODOS
    // if player was in queue?
    // leavequeue
    this.players = this.players.filter(
      (playerinQueue) => playerinQueue.id != player.id,
    );
    // if player was in game
    // end game with lost to the player
    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.player1 === player.id || game.player2 === player.id,
    );
    if (!currentPlayerRoom) return;
    let ff;
    if (currentPlayerRoom.player1 == player.userId) {
      ff = 1;
    } else if (currentPlayerRoom.player1 == player.userId) ff = 2;
    this.server.to(currentPlayerRoom.roomId).emit('gameOver', ff);
    this.removeGame(currentPlayerRoom.roomId);
    // this.leaveGame({roomId}, client )
    // else
    // do nting
  }

  async handleConnection(client: any, ...args: any[]) {
    const user = await this.authService.getUserFromSocket(client);
    if (!user) {
      //console.log("imposter")
      client.disconnect();
      return;
    }
    //console.log("new user", user.id)
    client.userId = user.id;
    this.server.to(client.id).emit('hehe');
  }
}
