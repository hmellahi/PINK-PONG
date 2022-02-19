import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dtos/createGame.dto';
import GameEntity from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    private userService: UserService,
  ) {}

  public async createGame(data: any) {
    var game: CreateGameDto = data;

    game.first_user = await this.userService.getById(data.user1Id);
    game.second_user = await this.userService.getById(data.user2Id);

    if (game.first_user_score > game.second_user_score)
    {
        await this.userService.increaseWins(game.first_user);
        await this.userService.increatLosses(game.second_user);
    }
    else
    {
        await this.userService.increaseWins(game.second_user);
        await this.userService.increatLosses(game.first_user);
    }

    const newGame = this.gameRepository.create(game);
    return await this.gameRepository.save(newGame);
  }

  public async getUserGames(user: UserEntity) {
    return await this.gameRepository.find({
      where: [{ first_user: user }, { second_user: user }],
      relations: ['first_user', 'second_user'],
    });
  }
}
