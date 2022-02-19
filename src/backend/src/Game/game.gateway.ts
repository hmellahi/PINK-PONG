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
import { v4 as uuidv4 } from 'uuid';
import { join } from 'node:path/win32';
import { GameService } from './game.service';

let MAX_SCORE = 9;
let ROOM_NOT_FOUND = 'room Not Found';
let ALREADY_IN_QUEUE = 'u cant join queue, because you are already in queue';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: 'http://127.0.0.1:5000',
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer() server: Server;

  getUserStatus(userId: number) {
    return this.users[userId] ? this.users[userId].status : 'Offline';
  }

  setUserStatus(userId: number, newStatus: string) {
    if (!this.users[userId]) return;
    this.users[userId].status = newStatus;
    this.server
      .to('activeUsers')
      .emit('userStatus', { userId, status: newStatus });
  }

  getUserId(userId: number) {
    console.log({ userId });
    return this.users[userId] ? this.users[userId].socketId : -1;
  }

  constructor(
    private authService: AuthService,
    private gameService: GameService,
  ) {}
  // usersInQueue: number[] = [];
  players: any[] = [];
  pendingRequests: any = {};
  liveGames: Game[] = [];
  username: string = '';
  users: any[] = [];

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('leaveQueue')
  leaveQueue(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() player: Socket | any,
  ) {
    this.players = this.players.filter(
      (playerinQueue) => playerinQueue.userId != player.userId,
    );
    this.setUserStatus(player.userId, 'Online');
    console.log(`client leaved queue: ${player.id}`);
  }

  @SubscribeMessage('joinQueue')
  joinQueue(@MessageBody() data: any, @ConnectedSocket() player: Socket | any) {
    let { map } = data;

    if (this.getUserStatus(player.userId) == 'In Queue')
      return { err: ALREADY_IN_QUEUE };

    this.setUserStatus(player.userId, 'In Queue');

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

    this.setUserStatus(player.userId, 'In Game');
    this.setUserStatus(secondPlayer.userId, 'In Game');

    // remove player from queue
    this.players.splice(this.players.indexOf(secondPlayer), 1);
  }

  checkBorders(canvas: any, ball: any): number {
    let borderWidth = Math.floor(canvas.width / 80);
    if (ball.x - ball.radius / 2 - borderWidth <= 0) return 2;
    if (ball.x + ball.radius / 2 + borderWidth >= canvas.width) return 1;
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
    if (!currentPlayerRoom) return { err: ROOM_NOT_FOUND };
    if (
      player.userId != currentPlayerRoom.player1 &&
      player.userId != currentPlayerRoom.player2
    )
      return { err: true, msg: 'u cant move the paddle hehe ;)' };

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
    if (!currentPlayerRoom) {
      return { err: ROOM_NOT_FOUND };
    }
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
        // this.server.to(roomId).emit('gameOver', ballHitsBorder);
        this.saveGame(currentPlayerRoom);
        this.removeGame(roomId);
      }
    }
  }

  @SubscribeMessage('inviteToPlay')
  inviteToGame(
    @MessageBody() data: any,
    @ConnectedSocket() sender: Socket | any,
  ) {
    let { receiver, senderName } = data;
    if (sender.userId == receiver)
      return { err: true, msg: 'u cant invite ur self hehe' };
    if (this.getUserStatus(receiver) == 'In Game')
      return { err: true, msg: 'this user is already in game, sorry' };
    if (this.getUserStatus(sender.userId) == 'In Game')
      return {
        err: true,
        msg: 'you are already in game, you cant invite people',
      };
    this.pendingRequests[receiver] = [];
    this.pendingRequests[receiver].push(sender.id);
    console.log({ id: this.getUserId(receiver) });
    sender.to(this.getUserId(receiver)).emit('inviteToPlay', {
      senderName,
      senderSocketId: sender.id,
      senderId: sender.userId,
    });
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
    @MessageBody() data: any,
    @ConnectedSocket() receiver: Socket | any,
  ) {
    let { senderId, senderSocketId } = data;
    console.log({ data });
    if (this.getUserStatus(receiver.userId) == 'Offline')
      return {
        err: true,
        msg: "this sender isnt online, can't accept invitation, sorry",
      };

    // remove senderId from pending requests
    if (!this.removePendingRequest(receiver.userId, senderSocketId))
      return { err: true, msg: 'the invitation is no longer available' };
    if (this.pendingRequests[receiver.userId].length == 0)
      this.pendingRequests.delete(receiver.userId);
    // create game
    const roomId = this.createGame(
      receiver.userId,
      senderId,
      receiver.id,
      senderSocketId,
      1,
    );
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
    const roomId = uuidv4();
    console.log({ roomId });
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
    // if (this.getUserStatus()){

    // }
    const currentGameState: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    // room doesnt exist
    if (!currentGameState) return { err: ROOM_NOT_FOUND };
    // update user status [inGame] TODO

    player.join(roomId);
    let isSpectator =
      player.userId != currentGameState.player1 &&
      player.userId != currentGameState.player2;
    // console.log()
    //console.log(player.userId, currentGameState.player1, currentGameState.player2, isSpectator);
    if (!isSpectator) {
      this.setUserStatus(player.userId, 'In Game');
    }
    let gameData = {
      player1: currentGameState.player1,
      player2: currentGameState.player2,
      isPlayer1: player.userId == currentGameState.player1,
      map: currentGameState.map,
      isSpectator,
    };
    //console.log("initial score", currentGameState.score1, currentGameState.score2)
    // console.table(this.users);
    return { msg: { gameData, currentGameState } };
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@MessageBody() data: any, @ConnectedSocket() player: Socket | any) {
    const { roomId } = data;

    const currentPlayerRoom: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );

    // room doesnt exist
    if (!currentPlayerRoom) return { err: ROOM_NOT_FOUND };

    const roomIndex = this.liveGames.indexOf(currentPlayerRoom);
    //console.log(roomIndex);
    let ff = 0;
    if (currentPlayerRoom.player1 == player.userId) {
      ff = 1;
    } else if (currentPlayerRoom.player2 == player.userId) ff = 2;
    else return 'wtf';
    // TODO SAVE IN DATABASE
    this.saveGame(currentPlayerRoom);
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
    // console.table(this.liveGames);
    return this.liveGames;
  }

  async handleDisconnect(player: Socket | any, ...args: any[]) {
    this.server
      .to('activeUsers')
      .emit('userStatus', { userId: player.userId, status: 'Offline' });
    // this.logger.log(`client leaved queue: ${client.id}`);
    console.log(`client disconnected: ${player.id}`);
    let userStatus = this.getUserStatus(player.userId);
    // console.table({ userStatus });
    // if player was in queue?
    // leavequeue
    if (userStatus == 'In Queue') {
      this.players = this.players.filter(
        (playerinQueue) => playerinQueue.userId != player.userId,
      );
    } else if (userStatus == 'In Game') {
      console.log(`was in game: ${player.id}`);
      // if player was in game
      // end game with lost to the player
      const currentPlayerRoom: Game = this.liveGames.find(
        (game) =>
          game.player1 === player.userId || game.player2 === player.userId,
      );
      console.log(`was here too: ${player.id}`);

      if (currentPlayerRoom) {
        let ff;
        if (currentPlayerRoom.player1 == player.userId) {
          ff = 1;
        } else if (currentPlayerRoom.player2 == player.userId) ff = 2;
        await this.server.to(currentPlayerRoom.roomId).emit('gameOver', ff);
        this.saveGame(currentPlayerRoom);
        this.removeGame(currentPlayerRoom.roomId);
      }
      console.log(`quited: ${player.id}`);
    }
    // else
    // do nting
    delete this.users[player.userId];
    // console.table(this.users);
  }

  saveGame(game: Game): void {
    console.log({ game });
    this.gameService.createGame({
      user1Id: game.player1,
      user2Id: game.player2,
      first_user_score: game.score1,
      second_user_score: game.score2,
      flag: game.ff,
      map: game.map,
    });
  }
  @SubscribeMessage('getUserStatus')
  getUserStatusById(
    @MessageBody() id: any,
    @ConnectedSocket() player: Socket | any,
  ) {
    player.join('activeUsers');
    return this.getUserStatus(id);
  }

  async handleConnection(client: any, ...args: any[]) {
    const user = await this.authService.getUserFromSocket(client);
    if (!user) {
      client.disconnect();
      return;
    }
    client.userId = user.id;
    this.server.to(client.id).emit('hehe');
    this.users[user.id] = {
      status: 'online',
      socketId: client.id,
    };
    // console.table(this.users);
  }
}
