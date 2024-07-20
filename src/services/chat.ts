import { Chat, ResponseBody } from "@/types";
import axiosClient from "@/utils/axiosClient"

export const getChatRooms = async (): Promise<ResponseBody<Chat[]>> => {
    const response = await axiosClient.get("/chat");
    return response.data;
}