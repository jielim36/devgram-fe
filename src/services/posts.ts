import { User } from "@/types/User";
import axiosClient from "@/utils/axiosClient";
import { Post, ResponseBody } from "@/types";

export const addPost = async (description: string, imgBlobArray: Blob[]): Promise<ResponseBody<boolean>> => {
    const formData = new FormData();
    formData.append("description", description);

    for (let i = 0; i < imgBlobArray.length; i++) {
        formData.append("files", imgBlobArray[i], `post${i}.jpeg`);
    }

    const response = await axiosClient.post(`/post`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;

}

export const getPopularPosts = async (): Promise<ResponseBody<Post[]>> => {
    const response = await axiosClient.get(`/post/popular`);
    return response.data;
}

export const getPostByPostId = async (postId: number): Promise<ResponseBody<Post>> => {
    const response = await axiosClient.get(`/post/${postId}`);
    return response.data;
}