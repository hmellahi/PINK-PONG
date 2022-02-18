import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './Strategys/accessJwt.strategy';
import { LocalStrategy } from './Strategys/local.strategy';
import { Oauth2Strategy } from './Strategys/oauth2.strategy';
import { RefreshJwtStgrategy } from './Strategys/refreshJwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStgrategy,
    Oauth2Strategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
