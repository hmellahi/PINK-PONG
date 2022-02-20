import { IsBoolean, isBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import UserEntity from "src/user/entities/user.entity";

export class CreateChannelDto
{
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    isLocked: boolean;

    password?: string;

    owner?: UserEntity;
}


export class JoinChannelDto
{
    @IsNotEmpty()
    @IsNumber()
    channelId: number;

    password?: string;

    user?: UserEntity;
}

export class UpdateChannelDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    type: string;

    name: string;

    isLocked: boolean;

    password: string;
}

export class DeleteChannelDto {
    @IsNotEmpty()
    @IsNumber()
    id: number
}
