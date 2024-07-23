import { Message } from "./Message";
import { User } from "./User";

export type Chat = {
    id?: number;
    user1: User;
    user2: User;
    latestMessage?: Message;
    unread_count?: number;
    created_at?: string;
}

export type ChatRequest = {
    id?: number;
    user1_id: number;
    user2_id: number;
    created_at?: string;
}
