import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common"
import { ErrorHandler } from "@nestjs/common/interfaces"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express-serve-static-core"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UserService } from "src/user/user.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
{
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ){
        super(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([(request: Request)=>
                    {
                        return request?.cookies?.Authentication;
                    }]),
                secretOrKey: configService.get('JWT_ACCESS_SECRET')
            }
        );
    }

    async validate(payload: TokenPayload)
    {
        try
        {
            const user = await this.userService.getById(payload.userId);

            if (!payload.isTwoFactorAuthenticated && user.two_factor_auth_active)
                throw UnauthorizedException;
            return user;
        }
        catch(error)
        {
            if (error?.code === HttpStatus.NOT_FOUND) // need to update
                throw new UnauthorizedException;
            throw new InternalServerErrorException;
        }
    }
}