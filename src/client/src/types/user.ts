export interface FriendsState {
  friends: any[]; // todo change
  blockedUsers: any[]; // todo change
  requests: any[]; // todo change
}

export interface UserState {
  isAuthenticated: boolean;
  user: User;
}

export interface User {
  username: string;
  avatarUrl: string;
  matches: any[];
  wins: Number;
  loses: Number;
}
export type friendShipStatus = "friends" | "blockedUsers";
