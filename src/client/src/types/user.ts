export interface FriendsState {
  friends: any[]; // todo change
  blockedUsers: any[]; // todo change
  requests: any[]; // todo change
}

export interface UserState {
  isAuthenticated: boolean;
  user: User;
  gameSocket:any
}

export interface User {
  login: string;
  avatar_url: string;
  status:string;
  matches: any[];
  wins: Number;
  loses: Number;
  two_factor_auth_enabled:Boolean;
}
export type friendShipStatus = "friends" | "blockedUsers";
