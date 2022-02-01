import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import UserEntity from './entities/user.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){}

    public async createUser(user: CreateUserDto)
    {
        const newUser =  this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    public async getByEmail(email: string): Promise<UserEntity>
    {
        return await this.userRepository.findOne({email: email});
        
        // if (user)
            // return user;
        // throw new HttpException("Email not found", HttpStatus.NOT_FOUND);
    }

    public async getById(id: number)
    {
        const user = await this.userRepository.findOne({id});

        if(user)
            return user;
        throw new HttpException('User Not Exist', HttpStatus.NOT_FOUND);
    }

    public async setRefreshToken(userId: number,token: string)
    {
        const user = await this.userRepository.findOne(userId);
        let hashToken: string;

        if (userId)
        {
            hashToken = await bcrypt.hash(token, 10);
            user.currentRefreshToken = hashToken;
            this.userRepository.save(user);
        }
    }
    public async removeRefreshToken(userId: number)
    {
        const user = await this.userRepository.findOne(userId);

        if (userId)
        {
            user.currentRefreshToken = null;
            this.userRepository.save(user);
        } 
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, id: number)
    {
        const user = await this.userRepository.findOne({id});

        if (user)
        {
            if (await bcrypt.compare(refreshToken, user.currentRefreshToken))
                return user;
        }
    }
}
