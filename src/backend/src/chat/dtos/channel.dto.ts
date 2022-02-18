import { IsBoolean, isBoolean, IsNotEmpty, IsNumber, isNumber, IsString, isString } from "class-validator";

export class CreateChannelDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    name: string;

    isLocked: boolean;

    password: string;
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
