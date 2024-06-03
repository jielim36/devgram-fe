export type User = {
    id: number;
    github_id?: string;
    google_id?: string;
    username: string;
    email?: string;
    avatar_url?: string;
    password?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};