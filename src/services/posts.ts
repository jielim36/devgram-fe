import { User } from "@/types/User";
import axiosClient from "@/utils/axiosClient";
import { Post, ResponseBody, SearchPost } from "@/types";

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

export const deletePost = async (postId: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.delete(`/post/${postId}`);
    return response.data;
}

export const updatePostDescription = async (postId: number, description: string): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/post/${postId}`, { description });
    return response.data;
}

export const getPopularPosts = async (): Promise<ResponseBody<Post[]>> => {
    const response = await axiosClient.get(`/post/popular`);
    return response.data;
}

export const getFollowingPosts = async (userId: number): Promise<ResponseBody<Post[]>> => {
    const response = await axiosClient.get(`/post/user/${userId}/following`);
    return response.data;
}

export const getPopularPostWithPagination = async (page: number): Promise<ResponseBody<Post[]>> => {
    const response = await axiosClient.get(`/post/popular/page/${page}`);
    return response.data;
}

export const getSearchPostWithPagination = async (page: number, searchValue: string): Promise<ResponseBody<SearchPost>> => {
    const response = await axiosClient.get(`/post/search`, {
        params: {
            value: searchValue,
            page: page,
        }
    }
    );
    return response.data;
}

export const getFollowingPostWithPagination = async (userId: number, page: number): Promise<ResponseBody<Post[]>> => {
    const response = await axiosClient.get(`/post/user/${userId}/following/page/${page}`);
    return response.data;
}

export const getPostByPostId = async (postId: number): Promise<ResponseBody<Post>> => {
    const response = await axiosClient.get(`/post/${postId}`);
    return response.data;
}

export const getPostsByUserId = async (userId: number): Promise<ResponseBody<Post[]>> => {
    const response = await axiosClient.get(`/post/user/${userId}`);
    return response.data;
}