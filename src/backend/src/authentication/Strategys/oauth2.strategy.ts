import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy} from "passport-oauth2"
import { catchError, take } from "rxjs";

@Injectable()

export class Oauth2Strategy extends PassportStrategy(Strategy, "outh2")
{
    constructor(
        private readonly configeService:ConfigService,
        private readonly httpService: HttpService
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
        const {data} = await this.httpService.get("https://api.intra.42.fr/v2/me",
        {
            headers: { Authorization: `Bearer ${ accessToken }` }
        }).pipe(take(1),
        catchError(()=> {throw new UnauthorizedException;})).toPromise();

        return data.email;
    }
}