import { HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy} from "passport-oauth2"
import { CreateUserDto } from "src/user/dtos/createUser.dto";
import { AuthService } from "../auth.service";

@Injectable()

export class Oauth2Strategy extends PassportStrategy(Strategy, "outh2")
{
    constructor(
        private readonly configeService:ConfigService,
        private readonly authService: AuthService
    ){
        super(
           {
            authorizationURL: configeService.get("AUTHORIZAION_URL"),
            tokenURL: configeService.get("TOKEN_API"),
            clientID: configeService.get("CLIENT_ID"),
            clientSecret: configeService.get("CLIENT_SECRET"),
            callbackURL: configeService.get("CALL_BACK_URL"),
            
           }
        )
    }

    
    async validate(accessToken: string)
    {
        const user: CreateUserDto = await this.authService.getUserFromIntranet(accessToken);
        return user;
    }
}