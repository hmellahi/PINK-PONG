import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import  UserEntity from "./entities/user.entity";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import BlockListEntity  from "./entities/blockedUserList.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [UserEntity, BlockListEntity]
            ),
        ConfigModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}