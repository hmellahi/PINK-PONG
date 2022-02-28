import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import  UserEntity  from "src/user/entities/user.entity";
import { AuthService } from "../auth.service";
import {UserAuthDataDto } from "../Dtos/userAuthData.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(private authservice:AuthService)
    {
        super({usernameField: 'email'});
    }
    
    async validate(email: string, password: string): Promise<UserEntity>
    {
        const credentials: UserAuthDataDto = {email, password}
        return await this.authservice.getAuthenticatedUser(credentials);
    }
}