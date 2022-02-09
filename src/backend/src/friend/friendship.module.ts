import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendshipService } from "./friendship.service";
// import FriendshipEntity from "./entities/friendship.enitity"

@Module({
    // imports:[TypeOrmModule.forFeature([FriendshipEntity])],
    providers: [FriendshipService],
    controllers: [],
    exports: [FriendshipService]
})
export class FriendshipModule {}