import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import  *  as joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './authentication/auth.module';

@Module(
{
  imports:
  [
    ConfigModule.forRoot(
      {
        validationSchema: joi.object(
          {
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
            CLIENT_SECRET: joi.string().required()
          }
        )
      }
    ),
    DatabaseModule,
    ConfigModule,
    UserModule,
    AuthModule
  ]
})
export class AppModule {}
