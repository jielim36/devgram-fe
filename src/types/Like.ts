import { User } from "./User";

export type Like = {
    id: number;
    user: User;
    parentId?: number;
    type: "post" | "comment";
    created_at: string;
}