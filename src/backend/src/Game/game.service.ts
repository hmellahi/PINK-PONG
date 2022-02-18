import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserEntity from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dtos/createGame.dto";
import GameEntity from "./entities/game.entity";
@Injectable()
export class GameService
{
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>
    ){}

    public async createGame(game: CreateGameDto)
    {
        const newGame = this.gameRepository.create(game);
        //increase wins score for winner
        // increase losses score for loser 
        return await this.gameRepository.save(newGame);
    }

    public async getUserGames(user: UserEntity)
    {
        return await this.gameRepository.find(
            {
                where: [{first_user: user}, {second_user: user}],
                relations: ['first_user', 'second_user']
            }
        )
    }
}