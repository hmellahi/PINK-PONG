
import User from "src/user/entities/user.entity";
export type Friendship_Status =
  | 'pending'
  | 'accepted'
  | 'declined';

  export interface FriendshipStatus {
    status?: Friendship_Status;
  }

export interface Friendship {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: Friendship_Status;
}