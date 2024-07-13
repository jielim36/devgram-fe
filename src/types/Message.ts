export type Message = {
    id: number;
    chat_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    refer_msg_id?: number;
    reaction?: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}