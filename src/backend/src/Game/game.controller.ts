import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/Guards/jwtAccess.guard';
import { RequestWithUser } from 'src/authentication/Interfaces/requestWithUser.interface';
import User from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateGameDto } from './dtos/createGame.dto';
import { GameService } from './game.service';

interface CC {
  user1Id: number;
  user2Id: number;
  first_user_score: number;
  second_user_score: number;
  flag: number;
  map: number;
}

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
    private userService: UserService,
  ) {}

  @Post('createGame')
  async createGame(@Body() data: any) {
    var game: CreateGameDto = data;

    console.log(data);
    game.first_user = await this.userService.getById(data.user1Id);
    game.second_user = await this.userService.getById(data.user2Id);

    await this.gameService.createGame(game);
  }

  @Get('games')
  async getGames(@Req() request: RequestWithUser) {
    return await this.gameService.getUserGames(request.user);
  }
}
