import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, UseFilters} from '@nestjs/common';
import { Game } from './Interfaces/Game.interface';
import { HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/Guards/jwtAccess.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/authentication/auth.service';

let MAX_SCORE = 5;

@WebSocketGateway({
  namespace: 'game',
  cors:
  {
    origin: "http://127.0.0.1:5000",
    credentials: true
  }
})

export class GameGateway {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService
  ){}
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
    console.log(`client leaved queue: ${player.id}`);
  }

  @SubscribeMessage('joinQueue')
  joinQueue(@MessageBody() data: any, @ConnectedSocket() player: Socket): void {
    let { map, userId } = data;

    // TODO CHECK FOR USER STAUS
    // console.log(
    //   `%c client joined queue: ${player.id}`,
    //   'background: #222; color: #bada55',
    // );
    const secondPlayer = this.players.find((player) => player.map == map);

    if (!secondPlayer) {
      this.players.push({ socket: player, map, userId });
      return;
    }
    // console.log(map, map);

    const roomId = this.createGame(
      userId,
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

    // remove playes from queue
    this.players.splice(this.players.indexOf(secondPlayer), 1);
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
      userId != currentPlayerRoom.player1 &&
      userId != currentPlayerRoom.player2
    )
      return 'u cant move the paddle hehe ;)';
    player.to(roomId).emit('paddleMoves', { paddle });
    // console.log(`player emitting: ${paddle}`);
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
  inviteToGame(@MessageBody() data: any, @ConnectedSocket() sender: Socket) {
    let { receiver } = data;
    this.pendingRequests[receiver] = sender.id;
    sender.to(receiver).emit('inviteToGame');
  }

  @SubscribeMessage('declineInvitation')
  declineInvitation(
    @MessageBody() data: any,
    @ConnectedSocket() receiver: Socket,
  ) {
    this.pendingRequests.delete(receiver);
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
      player1: player1ID, // TODO CHANGE USERID
      player2: player2ID, // TODO CHANGE USERID
      score1: 0,
      score2: 0,
      created_at: new Date(),
      map,
      ff: 0,
    });
    return roomId;
  }

  @SubscribeMessage('acceptInvitation')
  acceptInvitation(
    @MessageBody() data: any,
    @ConnectedSocket() receiver: Socket,
  ) {
    const senderSocketId = this.pendingRequests[receiver.id];
    // register the game
    const roomId = this.createGame(1, 1, receiver.id, senderSocketId, 1); // TODO CHANGE
    this.server
      .to(receiver.id)
      .to(senderSocketId)
      .emit('customGameStarted', roomId); // todo
    this.pendingRequests.delete(receiver.id);
  }

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() data: any, @ConnectedSocket() player: Socket) {
    const { roomId, userId } = data;

    const currentPlayerGame: Game = this.liveGames.find(
      (game) => game.roomId === roomId,
    );
    console.log("join game");
    // console.table(this.liveGames);
    //console.table(currentPlayerRoom);
    // room doesnt exist
    if (!currentPlayerGame) return 'roomNotFound';
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
      map: currentPlayerGame.map,
      isSpectator:
        userId != currentPlayerGame.player1 &&
        userId != currentPlayerGame.player2,
    };
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

  async handleConnection(client: Socket, ...args: any[]) {
      const user = await this.authService.getUserFromSocket(client);
      !user && client.disconnect();
  }
}
