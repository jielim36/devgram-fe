import { Message, ResponseBody } from "@/types";
import { Chat, ChatRequest } from "@/types/Chat";
import axiosClient from "@/utils/axiosClient";

export const addMessage = async (message: Message): Promise<ResponseBody<Message>> => {
    const response = await axiosClient.post(`/message`, message);
    return response.data;
}

export const initMessages = async (chat: ChatRequest): Promise<ResponseBody<Message[]>> => {
    const response = await axiosClient.get(`/message/init`, { params: chat });
    return response.data;
}

export const updateIsRead = async (chatId: number, receiverId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/message/read/${chatId}/receiver/${receiverId}`);
    return response.data;
}

export const deleteMessageById = async (message: Message): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.delete(`/message`, { data: message });
    return response.data;
}

export const addMessageReaction = async (message: Message): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/message/reaction`, message);
    return response.data;
}

export const updateMessageContent = async (message: Message): Promise<ResponseBody<Message>> => {
    const response = await axiosClient.put(`/message/content`, message);
    return response.data;
}