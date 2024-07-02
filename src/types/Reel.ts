import { Comment } from "./Comment";
import { User } from "./User";

export type Reel = {
    id: string;
    user: User;
    description: string;
    reel_url: string;
    platform: string;
    comments: Comment[];
    commentCount: number;
    likeCount: number;
    is_liked: boolean;
    updatedAt: string;
    createdAt: string;
};

export type ReelRequestBody = {
    description: string;
    reel_url: string;
    platform: string;
    user_id: number;
};

export enum ReelPlatformEnum {
    YOUTUBE = "YOUTUBE",
}