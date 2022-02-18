import User from "src/user/entities/user.entity";

export class CreateGameDto
{
    first_user: User;
    second_user: User;
    first_user_score: number;
    second_user_score: number;
    flag: number;
    map: number;
}