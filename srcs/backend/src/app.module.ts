import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './authentication/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FriendshipModule } from './friend/friendship.module';
import { GameGateway } from './Game/game.gateway';
import { GameModule } from './Game/game.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      validationSchema: joi.object({
        HOST: joi.string().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().required(),
        DB_NAME: joi.string().required(),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        PORT: joi.number(),
        JWT_ACCESS_SECRET: joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: joi.string().required(),
        JWT_REFRESH_SECRET: joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: joi.string().required(),
        TOKEN_API: joi.string().required(),
        AUTHORIZAION_URL: joi.string().required(),
        CALL_BACK_URL: joi.string().required(),
        CLIENT_ID: joi.string().required(),
        CLIENT_SECRET: joi.string().required(),
        AVATAR_API: joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/public',
    }),
    DatabaseModule,
    ConfigModule,
    UserModule,
    FriendshipModule,
    AuthModule,
    GameModule,
    ChatModule,
  ],
})
export class AppModule {}
