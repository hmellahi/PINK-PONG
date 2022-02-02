import { Body, 
        Controller, Get, HttpCode,
        HttpException,
        Param, Post, Query, Redirect, Req, Request, Res,
        UnauthorizedException,
        UseGuards
     } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/createUser.dto";
import { AuthService } from "./auth.service";
import { LocalAuthenticationGuard } from "./Guards/localAuthentication.guard";
import { RequestWithUser } from "./Interfaces/requestWithUser.interface";
import { JwtAuthGuard } from "./Guards/jwtAccess.guard";
import { UserService } from "src/user/user.service";
import  {JwtRefreshGuard} from "./Guards/jwtRefresh.guard";
import  UserEntity  from "src/user/entities/user.entity";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse , AxiosError} from "axios";
import { catchError, interval, map, of, throwError } from "rxjs";
import { Oauth2Guard } from "./Guards/outh2.guard";
import { Oauth2Strategy } from "./Strategys/oauth2.strategy";
import e, { Response } from "express";

@Controller("auth")
export class AuthController
{
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private httpService: HttpService
        ){}

    @Post("/register")
    @HttpCode(200)
    async register(@Body() credentials: CreateUserDto): Promise<string>
    {
        await this.authService.register(credentials);
        return "user added"
    }

    // @UseGuards(LocalAuthenticationGuard)
    @UseGuards(Oauth2Guard)
    @Get("/callback")
    async connect(@Req() request: RequestWithUser,@Res() response: Response)
    {
        const {user} = request;
        // const cookie = this.authService.getAccessJwtCookie(user.id);
        
        let existedUser = await this.userService.getByEmail(user.email);

        if (!existedUser)
            existedUser = await this.authService.register(user);
        console.log(existedUser);
        const cookie = this.authService.getAccessJwtCookie(existedUser.id,
                        existedUser.two_factor_auth_active);
        const refresh = this.authService.getRefreshJwtCookie(existedUser.id);

        await this.userService.setRefreshToken(existedUser.id, refresh.token);
        response.setHeader("set-cookie", cookie);
        response.send({
            isTwoFactorAuthonticator: existedUser.two_factor_auth_active
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async getSomthing(@Req() request: RequestWithUser ,@Res() response: Response)
    {
        const {user} = request;
        const cookie: string[] = this.authService.getCookieForLogOut();
        // remove refresh token from database
        await this.userService.removeRefreshToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        return response.sendStatus(200);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    async refresh(@Req() request: RequestWithUser,@Res() response: Response)
    {
        const user: UserEntity = request.user;
        const accessCookie: string = this.authService.getAccessJwtCookie(user.id);

        response.setHeader('Set-Cookie', accessCookie);
        return response.sendStatus(200);
    }

    // two factor auth
    // use Guard jwt token
    @Get("2fa/generate")
    async generateTwoFactroAuthCode(@Req() request: RequestWithUser,
                                    @Res() response: Response)
    {
        const {user} = request;
        const {
            otpauthUrl,
            base32
        } = this.authService.getTwoFactorAuthenticationCode();
        // insert base32 into databas "later"
        // this.userService.findByIdAndUpdate(user.id, {two_factor_auth_code: base32});
        this.authService.respondWithQrCode(otpauthUrl, response)
    }
    //
    // for testing
    @UseGuards(JwtAuthGuard)
    @Get('isLog')
    async isLogin(@Res() resp: Response)
    {
        resp.sendStatus(200);
    }
}