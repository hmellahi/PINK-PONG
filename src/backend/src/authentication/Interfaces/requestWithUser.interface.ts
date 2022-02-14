import UserEntity  from "src/user/entities/user.entity";
import { Socket, Server } from 'socket.io';
export interface RequestWithUser extends Request
{
    user?: UserEntity;
}

export interface SocketWithUser extends Socket
{
    user?: UserEntity;
}