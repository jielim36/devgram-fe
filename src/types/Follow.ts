import { User } from "./User";

export type FollowList = {
    userId?: number;
    followingList?: User[];
    followerList?: User[];
    followingCount?: number;
    followerCount?: number;
}