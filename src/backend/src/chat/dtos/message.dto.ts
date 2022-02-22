import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import UserEntity from "src/user/entities/user.entity";
import ChannelEntity from "../entities/channel.entity";

export class GetMessagesDto
{
    @IsNotEmpty()
    @IsNumber()
    channelId:number;
}

export class MessageDto {

    @IsNotEmpty()
    msg: string;

    @IsNotEmpty()
    @IsNumber()
    channelId: number;
}