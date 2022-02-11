export interface Channel {
  name: string;
  password?: string;
  membersCount?: Number;
  isPrivate?: Boolean;
  // more
}

export interface Message {
  sender: string;
  content: string;
  isAdmin: Boolean;
  date: string;
  showTooltip?:Boolean;
}

export interface directMessage{
  last_msg:String;
  avatar:String;
  name:String;
}