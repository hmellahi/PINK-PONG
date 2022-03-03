export interface FriendsState {
  friends: any[]; // todo change
  blockedUsers: any[]; // todo change
  requests: any[]; // todo change
}

export interface UserState {
  isAuthenticated: boolean;
  user: User;
  gameSocket: any;
  achievments: any;
}

export interface User {
  id?: number;
  login: string;
  image_url: string;
  status: string;
  matches: any[];
  wins: number;
  losses: number;
  two_factor_auth_enabled: Boolean;
}
export type friendShipStatus = "friends" | "blockedUsers";
