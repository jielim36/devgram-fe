import { User } from "./User";

export type Comment = {
    user: User;
    comment: string;
    children?: Comment[];
    created_at: string;
    updated_at: string;
}