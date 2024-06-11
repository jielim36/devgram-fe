import { ResponseBody } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const likePost = async (postId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post(`/post/${postId}/likes`);
    return response.data;
}

export const unlikePost = async (postId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/post/${postId}/likes`);
    return response.data;
}

export const likeComment = async (commentId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post(`/comment/${commentId}/likes`);
    return response.data;
}

export const unlikeComment = async (commentId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/comment/${commentId}/likes`);
    return response.data;
}
