import { Comment } from "./Comment";
import { User } from "./User";

export type Post = {
    id: number;
    user: User;
    description: string;
    images: string[];
    comments: Comment[];
    created_at: string;
    updated_at: string;
}