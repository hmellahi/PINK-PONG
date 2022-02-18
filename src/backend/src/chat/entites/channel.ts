export interface Channel {
  id: number
  type: string;
  name: string;
  isLocked?: Boolean;
  membersCount?: Number;
  avatarUrl?: string;
  username?: string;
  lastMsg?: string;
  createdAt: Date; 
}
