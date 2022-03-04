import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/Guards/jwtAccess.guard';
import { RequestWithUser } from 'src/authentication/Interfaces/requestWithUser.interface';
import User from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
    private userService: UserService,
  ) {}

  /*  
    endpoint for tesing
  */
  @Post('createGame')
  async createGame(@Body() data: any) {
    await this.gameService.createGame(data);
  }

  @Post('games')
  async getGames(@Body('user') user: User, @Req() request: RequestWithUser) {
    return await this.gameService.getUserGames(user);
  }
}
