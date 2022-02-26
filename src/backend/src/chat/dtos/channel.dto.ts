import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import UserEntity from 'src/user/entities/user.entity';

export class CreateChannelDto {
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

export class JoinChannelDto {
  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsString()
  password?: string;

  user?: UserEntity;
}

export class AddMemberDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;
}

export class LeaveChannelDto {
  @IsNotEmpty()
  @IsNumber()
  channelId: number;
}

export class UpdateChannelPassword {
  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsBoolean()
  isLocked: boolean;

  password: string;
}

export class AddAdminDto {
  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class BanUserDto {
  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsBoolean()
  isPermanant: Boolean;

}


export class MuteMemberDto {
  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsDateString()
  expireDate: Date;
}
