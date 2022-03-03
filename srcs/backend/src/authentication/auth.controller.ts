import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/createUser.dto';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './Guards/localAuthentication.guard';
import { RequestWithUser } from './Interfaces/requestWithUser.interface';
import { JwtAuthGuard } from './Guards/jwtAccess.guard';
import { UserService } from 'src/user/user.service';
import { JwtRefreshGuard } from './Guards/jwtRefresh.guard';
import UserEntity from 'src/user/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { catchError, interval, map, of, throwError } from 'rxjs';
import { Oauth2Guard } from './Guards/outh2.guard';
import { Oauth2Strategy } from './Strategys/oauth2.strategy';
import e, { response, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @UseGuards(Oauth2Guard)
  @Get('login')
  login() {}

  @UseGuards(Oauth2Guard)
  @Get('callback')
  async connect(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    let existedUser = await this.userService.getByEmail(user.email);
    let redirectiUrl = this.configService.get('TWO_FACTOR_LOGIN_PAGE');
    let newUser = false;

    if (!existedUser) {
      existedUser = await this.authService.register(user);
      newUser = true;
    }
    const cookies: string[] = [
      this.authService.getAccessJwtCookie(existedUser.id),
    ];
    if (!existedUser.two_factor_auth_enabled) {
      const refresh = this.authService.getRefreshJwtCookie(existedUser.id);
      cookies.push(refresh.cookie);
      await this.userService.setRefreshToken(existedUser.id, refresh.token);

      if (newUser) redirectiUrl = this.configService.get('SETTING_URL');
      else redirectiUrl = this.configService.get('HOME_PAGE_URL');
    }
    response.setHeader('set-cookie', cookies);
    response.redirect(redirectiUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async getSomthing(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = request;
    const cookie: string[] = this.authService.getCookieForLogOut();
    // remove refresh token from database
    await this.userService.removeRefreshToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser, @Res() response: Response) {
    const user: UserEntity = request.user;
    const accessCookie: string = this.authService.getAccessJwtCookie(user.id);

    response.setHeader('Set-Cookie', accessCookie);
    return response.sendStatus(200);
  }

  //=========================two factor auth================================//
  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async generateTwoFactroAuthCode(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = request;

    if (user.two_factor_auth_enabled)
      throw new HttpException('2fa alerady enabled!!', HttpStatus.BAD_REQUEST);
    const { otpauthUrl, base32 } =
      this.authService.getTwoFactorAuthenticationCode();
    // insert base32 into databas "later"
    this.userService.findByIdAndUpdate(user.id, {
      two_factor_auth_code: base32,
    });
    this.authService.respondWithQrCode(otpauthUrl, response);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('2fa/enableTwoFactorAuth')
  async enableTwoFactorAuth(
    @Body('code') twoFactorAuthCode: string,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;

    if (
      !(await this.authService.switchTwoFactorAuthStatus(
        twoFactorAuthCode,
        user,
        true,
      ))
    )
      throw new BadRequestException();
    // logout
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('2fa/disableTwoFactorAuth')
  async disableTwoFactorAuth(
    @Body('code') twoFactorAuthCode: string,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;

    if (
      !(await this.authService.switchTwoFactorAuthStatus(
        twoFactorAuthCode,
        user,
        false,
      ))
    )
      throw new BadRequestException();
    //logout
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/login')
  async twoFactorAuthLogin(
    @Req() request: RequestWithUser,
    @Body('code') twoFactorAuthCode: string,
    @Res() response: Response,
  ) {
    const { user } = request;

    if (user.two_factor_auth_enabled) {
      const isValid = this.authService.verifyTwoFactorAuthCode(
        twoFactorAuthCode,
        user,
      );

      if (!isValid) throw new BadRequestException();
      const accessCookie = this.authService.getAccessJwtCookie(user.id, true);
      const refresh = this.authService.getRefreshJwtCookie(user.id);
      await this.userService.setRefreshToken(user.id, refresh.token);
      response.setHeader('set-cookie', [refresh.cookie, accessCookie]);
      response.sendStatus(200);
    }
  }

  //=====================================================================//

  //=======================Testing=================================
  @UseGuards(JwtAuthGuard)
  @Get('isLog')
  async isLogin(@Req() request: RequestWithUser, @Res() resp: Response) {
    const { user } = request;
    resp.send(user);
  }

  @Post('testLogin')
  async testLogin(@Body() user: CreateUserDto, @Res() response: Response) {
    let existedUser = await this.userService.getByEmail(user.email);

    if (!existedUser) existedUser = await this.authService.register(user);
    const accessCookie = this.authService.getAccessJwtCookie(
      existedUser.id,
      true,
    );
    const refresh = this.authService.getRefreshJwtCookie(existedUser.id);
    await this.userService.setRefreshToken(existedUser.id, refresh.token);
    response.setHeader('set-cookie', [refresh.cookie, accessCookie]);
    response.sendStatus(200);
  }

  //==============================================================
}
