import { Comment } from "./Comment";
import { Like } from "./Like";
import { User } from "./User";

export type Post = {
    id: number;
    user: User;
    description: string;
    images_url: string[];
    comments: Comment[];
    likes?: Like[];
    created_at: string;
    updated_at: string;
}