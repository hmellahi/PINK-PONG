import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class MessageDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    message: string;
}