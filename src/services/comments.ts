import axiosClient from "@/utils/axiosClient";
import { Comment, ResponseBody } from "@/types";

export const addComment = async (postId: number, parentId: number, content: string): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post(`/comment/${postId}`, null, {
        params: {
            parentId,
            content,
        },
    });

    return response.data;
}