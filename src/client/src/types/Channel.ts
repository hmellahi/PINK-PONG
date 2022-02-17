export interface Channel {
  type: string;
  name: string;
  isLocked?: Boolean;
  membersCount?: Number;
  avatarUrl?: string;
  username?: string;
  lastMsg?: string;
  createdAt?: Date;
}

export interface Message {
  user_id: string;
  message: string;
  isAdmin: Boolean;
  channelId: string;
  createdAt?: Date | string;
  sender: string;
  showTooltip?: Boolean;
}

export interface directMessage {  
  last_msg: String;
  avatar: String;
  name: String;
}
