import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/createUser.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { PostgresErrorCode } from "src/database/postgresErrorCodes.enum";
import { UserAuthDataDto } from "./Dtos/userAuthData.dto";
import UserEntity from "src/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { catchError, lastValueFrom, map, Observable, take } from "rxjs";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import * as speakeasy from "speakeasy"
import * as QRCode from "qrcode"
import internal from "stream";
import { Socket} from 'socket.io';
import { WsException } from "@nestjs/websockets";
import { parse } from "cookie";


@Injectable()

export class AuthService
{
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
        ){}

    public async register(user: CreateUserDto)
    {
        try
        {
            // const randomNumber: number = Math.round(Math.random() * 10000);
            // user.image_url = this.configService.get("AVATAR_API") + randomNumber + '.svg';
            return await this.userService.createUser(user);
        }
        catch(error)
        {
            if (error?.code === PostgresErrorCode.UniqueViolation)
                throw new HttpException("Email alerady exist", HttpStatus.BAD_REQUEST);
            throw new InternalServerErrorException();
        }
    }

    public async getAuthenticatedUser(credentials: UserAuthDataDto): Promise<UserEntity>
    {
        try
        {
            const user = await this.userService.getByEmail(credentials.email);
            await this.verifyPassword(user.password, credentials.password);
            return user;

        }catch(error)
        {
            throw new HttpException("Wrong credintials", HttpStatus.BAD_REQUEST);
        }

    }

    public async verifyPassword(hashedPassword:string, plainTextPasword:string)
    {
        const isMatching = bcrypt.compareSync(plainTextPasword,
            hashedPassword);
        if (!isMatching)
            throw new HttpException("Wrong credintials", HttpStatus.BAD_REQUEST);
    }

    public getAccessJwtCookie(userId: number, isTwoFactorAuthenticated = false)
    {
        const payload: TokenPayload = {userId, isTwoFactorAuthenticated};
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token};  Path=/;`+
                `max-Age=${this.configService.get('JWT_ACCESS_EXPIRATION_TIME')}`;
    }

    public getRefreshJwtCookie(userId: number)
    {
        const payload: TokenPayload = {userId, isTwoFactorAuthenticated: true};
        const token = this.jwtService.sign(payload,{
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}`
        });
        const cookie = `Refresh=${token};  Path=/;`+
                        `max-Age=${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}`;
        return {token, cookie}
    }

    public getCookieForLogOut() {
        return [`Authentication=;  Path=/; Max-Age=0`,
                `Refresh=;  Path=/; Max-Age=0`];
      }

    public async getUserFromIntranet(accessToken: string): Promise<CreateUserDto>
    {
        //fetch user's data from Intranet
        const observable: Observable<CreateUserDto> = this.httpService.get<CreateUserDto>("https://api.intra.42.fr/v2/me",
        {
            headers: { Authorization: `Bearer ${ accessToken }` }
        })
        .pipe(
            map((response: AxiosResponse<CreateUserDto>)=> response.data
        ),
        catchError((e)=> {
            //console.log("Intra Error");
        throw new UnauthorizedException;}));

        const user: CreateUserDto = await lastValueFrom(observable);
        return user;
    }

    // two factor auth

    public getTwoFactorAuthenticationCode()
    {
        const secretCode = speakeasy.generateSecret(
            {
                name: this.configService.get("TWO_FACTOR_AUTH_APP_NAME")
            }
        );

        return {
                otpauthUrl: secretCode.otpauth_url,
                base32: secretCode.base32
            };
    }

    public respondWithQrCode(data: string, response: internal.Writable)
    {
        QRCode.toFileStream(response, data);
    }

    public verifyTwoFactorAuthCode(twoFactorAuthCode: string, user:UserEntity)
    {
        return speakeasy.totp.verify({
            secret: user.two_factor_auth_code,
            encoding: 'base32',
            token: twoFactorAuthCode
        })
    }

    public async switchTwoFactorAuthStatus( // action = false ==> disable | action = true ==> enable
        twoFactorAuthCode: string,
        user: UserEntity,
        action: boolean): Promise<boolean>
    {
        if (user.two_factor_auth_enabled !== action)
        {
            const isValid = this.verifyTwoFactorAuthCode(twoFactorAuthCode, user);

            if (!isValid)
                return false;
            await this.userService.findByIdAndUpdate(user.id,
                {two_factor_auth_enabled: action})
        }
        return true;
    }
    private async getUserFromToken(token: string)
    {
        let tokenPayload: TokenPayload;
        try
        {
           tokenPayload = await this.jwtService.verify(token,{
    
                secret:this.configService.get('JWT_ACCESS_SECRET')
            });
        }
        catch(err){tokenPayload = undefined;}
            

        if (tokenPayload && tokenPayload.userId)
            return await this.userService.getById(tokenPayload.userId);
        else
            return undefined;
    }

    public async getUserFromSocket(socket: Socket)
    {
        try
        {
            const Authentication :any = socket.handshake.headers.authentication;
            if (!Authentication)
                return undefined;
            return await this.getUserFromToken(Authentication);
        }
        catch(error)
        {
            return undefined;
        }
    }
}