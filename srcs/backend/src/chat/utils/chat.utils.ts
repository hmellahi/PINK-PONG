import UserEntity from "src/user/entities/user.entity";
import ChannelEntity from "../entities/channel.entity";

export const getRole = (user: UserEntity, channel: ChannelEntity) =>
{
    if (channel.owner && user.id == channel.owner.id)
        return "owner";
    if (isAdmin(channel.admins, user))
        return "admin";
    return "member";
}

export const isMember = (members: UserEntity[], userToFind: UserEntity) =>
{
    return members.find(user => user.id === userToFind.id);
}

export const isAdmin = (admins: UserEntity[], userToFind: UserEntity) =>
{
    return admins.find(user => user.id === userToFind.id) !== undefined;
}

export const isBaned = (banedUsers: UserEntity[], userToFind: UserEntity) =>
{
    return banedUsers.find(user => user.id === userToFind.id);
}
