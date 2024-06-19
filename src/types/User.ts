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
    is_active: boolean;
    is_following?: boolean;
    created_at: string;
    updated_at: string;
};

export type UserInfo = {
    id: number;
    user_id: number;
    address: string;
    gender: string;
    bio: string;
    birthday: string;
}