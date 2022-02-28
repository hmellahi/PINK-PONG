export interface Channel {
  type: string;
  id?: string;
  name: string;
  isLocked?: Boolean;
  membersCount?: Number;
  avatarUrl?: string;
  username?: string;
  lastMsg?: string;
  createdAt?: Date;
  password?: string;
}

export interface Message {
  user_id: number;
  message: string;
  isAdmin: Boolean;
  channelId: string;
  createdAt?: Date | string;
  sender: string;
  showTooltip?: Boolean;
  owner:any
}

export interface directMessage {
  last_msg: String;
  avatar: String;
  name: String;
}
