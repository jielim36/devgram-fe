import { Like } from "./Like";
import { User } from "./User";

export type Comment = {
    id: number;
    user: User;
    content: string;
    parent_id?: number;
    children?: Comment[];
    likes?: number;
    is_liked?: boolean;
    created_at: string;
    updated_at: string;
}