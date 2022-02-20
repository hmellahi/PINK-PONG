import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/authentication/auth.module";
import { UserModule } from "src/user/user.module";
import GameEntity from "./entities/game.entity";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
    imports:
    [
        AuthModule,
        TypeOrmModule.forFeature([
            GameEntity
        ]),
        UserModule
    ],
    controllers: [GameController],
    providers: [GameGateway, GameService]
})
export class GameModule {}