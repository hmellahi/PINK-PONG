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

    console.log(data);
    game.first_user = await this.userService.getById(data.user1Id);
    game.second_user = await this.userService.getById(data.user2Id);
    const newGame = this.gameRepository.create(game);
    //increase wins score for winner
    // increase losses score for loser
    return await this.gameRepository.save(newGame);
  }

  public async getUserGames(user: UserEntity) {
    return await this.gameRepository.find({
      where: [{ first_user: user }, { second_user: user }],
      relations: ['first_user', 'second_user'],
    });
  }
}
