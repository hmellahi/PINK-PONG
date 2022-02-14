import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendshipService } from "./friendship.service";
import FriendshipEntity from "./entities/friendship.entity"
import { FriendshipController } from "./friendship.controller";
import {UserModule} from "src/user/user.module"
@Module({
    imports:[
        TypeOrmModule.forFeature([FriendshipEntity]),
        forwardRef(()=> UserModule)
    ],
    providers: [FriendshipService],
    controllers: [FriendshipController],
    exports: [FriendshipService]
})
export class FriendshipModule {}