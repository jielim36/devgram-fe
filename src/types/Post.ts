import { User } from "./User";

export type Post = {
    id: number;
    user: User;
    description: string;
    images: string[];
}