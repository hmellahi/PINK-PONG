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

let MAX_SCORE = 1;

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
    console.table(this.users);
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
    this.removePlayer(player.userId);
    this.setUserStatus(player.userId, 'Online');
    // console.log(`client leaved queue: ${player.id}`);
  }

  @SubscribeMessage('userStatus')
  userStatus(
    @MessageBody() status: string,
    @ConnectedSocket() player: Socket | any,
  ) {
    this.setUserStatus(player.userId, status);
  }

  removePlayer(playerId: number) {
    this.players = this.players.filter(
      (playerinQueue) => playerinQueue.userId != playerId,
    );
  }

  @SubscribeMessage('joinQueue')
  joinQueue(@MessageBody() data: any, @ConnectedSocket() player: Socket | any) {
    let { map } = data;

    // console.log(`client joined queue: ${player.id}`);
    console.table(this.players);
    if (
      this.players.find(
        (playersInQueue) => playersInQueue.userId === player.userId,
      ) ||
      this.getUserStatus(player.userId) == 'In Queue'
    )
      return { err: ALREADY_IN_QUEUE };

    // console.log(`client heree: ${player.id}`);
    this.setUserStatus(player.userId, 'In Queue');

    const secondPlayer = this.players.find((player) => player.map == map);

    // console.log(`client dd: ${player.id}`);
    if (!secondPlayer) {
      this.players.push({ socket: player, map, userId: player.userId });
      return;
    }
    // console.log({ d: secondPlayer });
    let roomId;
    try {
      roomId = this.createGame(
        player.userId,
        secondPlayer.userId,
        player.id,
        secondPlayer.socket.id,
        map,
      );
    } catch (err) {
      return { err: 'something went wrong' };
    }

    // alert players
    this.server
      .to(secondPlayer.socket.id)
      .to(player.id)
      .emit('matchFound', roomId);

    this.setUserStatus(player.userId, 'In Game');
    this.setUserStatus(secondPlayer.userId, 'In Game');

    // remove player from queue
    this.removePlayer(player.userId);
    this.removePlayer(secondPlayer.userId);
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
        this.setUserStatus(currentPlayerRoom.player1, 'Online');
        this.setUserStatus(currentPlayerRoom.player2, 'Online');
      }
    }
  }

  @SubscribeMessage('inviteToPlay')
  inviteToGame(
    @MessageBody() data: any,
    @ConnectedSocket() sender: Socket | any,
  ) {
    console.log({ data });
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
    // console.log('heeeyo');
    // if (
    //   this.pendingRequests[receiver] &&
    //   this.pendingRequests[receiver].find((senderId) => senderId == sender.id)
    // )
    //   return {
    //     err: true,
    //     msg: 'you already sent this user a request',
    //   };
    this.pendingRequests[receiver] = [];
    this.pendingRequests[receiver].push(sender.id);
    // console.log('heeeyo1');
    if (this.getUserId(receiver) == -1) return;
    // sender.to(this.getUserId(receiver)).emit('inviteToPlay', {
    //   senderName,
    //   senderSocketId: sender.id,
    //   senderId: sender.userId,
    console.log({ id: this.getUserId(receiver) });
    // });
    sender.to('activeUsers').emit('inviteToPlay', {
      senderName,
      senderSocketId: sender.id,
      senderId: sender.userId,
      receiver,
    });
    // sender.to(this.getUserId(receiver)).emit('inviteToPlay', {
    //   senderName,
    //   senderSocketId: sender.id,
    //   senderId: sender.userId,
    //   receiver,
    // });
  }

  @SubscribeMessage('declineInvitation')
  declineInvitation(
    @MessageBody() data: any,
    @ConnectedSocket() receiver: Socket | any,
  ) {
    let { senderSocketId, senderId } = data;
    console.log({ senderSocketId, senderId });
    if (!this.removePendingRequest(receiver.userId, senderSocketId)) {
      console.log('wazbi');
      return { err: true, msg: 'the invitation is no longer available' };
    }
  }

  removePendingRequest(recieverId: number, senderId: number) {
    if (!this.pendingRequests[recieverId]) return true;
    let oldSize = this.pendingRequests[recieverId].length;
    console.log({ recieverId });
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
    // console.log({ data });
    if (this.getUserStatus(receiver.userId) == 'In Game')
      return {
        err: true,
        msg: "this sender in already in game or offline, you can't accept invitation, sorry",
      };

    // remove senderId from pending requests
    if (!this.removePendingRequest(receiver.userId, senderSocketId))
      return { err: true, msg: 'the invitation is no longer available' };
    if (this.pendingRequests[receiver.userId].length == 0)
      delete this.pendingRequests[receiver.userId];
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
    // console.log({ roomId });
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
    this.liveGames[roomIndex].ff = ff;
    this.saveGame(currentPlayerRoom);
    // Inform everyone that game ends
    this.server.to(roomId).emit('gameOver', ff);
    this.removeGame(roomId);
    this.setUserStatus(currentPlayerRoom.player1, 'Online');
    this.setUserStatus(currentPlayerRoom.player2, 'Online');
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
    return this.liveGames;
  }

  async handleDisconnect(player: Socket | any, ...args: any[]) {
    this.setUserStatus(player.userId, 'Offline');
    let userStatus = this.getUserStatus(player.userId);
    // console.table({ userStatus });
    // if player was in queue?
    // leavequeue
    if (userStatus == 'In Queue') {
      this.removePlayer(player.userId);
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
    // delete this.users[player.userId];
    console.log(
      '----------------------------------------------------------------',
    );
    console.table(this.users);
    // this.users.splice(this.users.indexOf(this.users[player.userId]), 1);
    // this.users = this.users.filter((user) => user.status != 'Offline');
    delete this.users[player.userId];
    console.log(
      '----------------------------------------------------------------',
    );
    console.table(this.users);
    console.log('client disconnected', player.userId);
    // console.table(this.users);
  }

  saveGame(game: Game): void {
    console.log({ game });
    this.gameService.createGame({
      user1Id: game.player1,
      user2Id: game.player2,
      first_user_score: game.score2,
      second_user_score: game.score1,
      flag: game.ff,
      map: game.map,
    });
  }

  @SubscribeMessage('getUserStatus')
  getUserStatusById(
    @MessageBody() id: any,
    @ConnectedSocket() player: Socket | any,
  ) {
    return this.getUserStatus(id);
  }

  async handleConnection(client: any, ...args: any[]) {
    const user = await this.authService.getUserFromSocket(client);
    if (!user) {
      client.disconnect();
      console.error('IMPOSTER ');
      return;
    }
    client.userId = user.id;
    console.log('client connected', client.userId);
    client.join('activeUsers');
    this.users[user.id] = {
      status: 'Online',
      socketId: client.id,
    };
    console.table(this.users);
    this.setUserStatus(client.userId, 'Online');
    this.server.to(client.id).emit('hehe');
  }
}
