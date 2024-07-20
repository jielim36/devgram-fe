import { Message, ResponseBody } from "@/types";
import { Chat } from "@/types/Chat";
import axiosClient from "@/utils/axiosClient";

export const addMessage = async (message: Message): Promise<ResponseBody<Message>> => {
    const response = await axiosClient.post(`/message`, message);
    return response.data;
}

export const initMessages = async (chat: Chat): Promise<ResponseBody<Message[]>> => {
    const response = await axiosClient.get(`/message/init`, { params: chat });
    return response.data;
}