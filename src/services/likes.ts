import { ResponseBody } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const addLikeByPostId = async (postId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post(`/post/${postId}/likes`);
    return response.data;
}

export const removeLikeByPostId = async (postId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/post/${postId}/likes`);
    return response.data;
}