import { Story } from "./Story";

export type User = {
    id: number;
    github_id?: string;
    google_id?: string;
    username: string;
    email?: string;
    avatar_url?: string;
    password?: string;
    stories?: Story[];
    userInfo?: UserInfo;
    is_active: boolean;
    is_following?: boolean;
    created_at: string;
    updated_at: string;
};

export type UserInfo = {
    id?: number;
    user_id: number;
    address?: string;
    gender?: "Male" | "Female" | "Other";
    bio?: string;
    birthday?: string;
}

export type UpdateUserInfo = {
    username?: string;
    userInfoEntity?: UserInfo;
}

export type SearchUser = {
    data: User[];
    page: number;
    total: number;
    limit: number;
}