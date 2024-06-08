import { Like } from "./Like";
import { User } from "./User";

export type Comment = {
    id: number;
    user: User;
    content: string;
    children?: Comment[];
    likes?: number;
    created_at: string;
    updated_at: string;
}