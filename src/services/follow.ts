import { FollowList, ResponseBody, User } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const isFollowing = async (follower_id: number, following_id: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.get(`/follow/isFollowing`, { params: { follower_id, following_id } });
    return response.data;
}

export const follow = async (follower_id: number, following_id: number): Promise<ResponseBody<boolean>> => {

    const response = await axiosClient.post(`/follow`, { follower_id, following_id });
    return response.data;
}

export const unFollow = async (follower_id: number, following_id: number): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/follow`, { follower_id, following_id });
    return response.data;
}

export const getFollowingList = async (following_id: number, pages: number): Promise<ResponseBody<User[]>> => {
    // const formData = new FormData();
    // formData.append("following_id", following_id.toString());
    // formData.append("pages", pages.toString());
    const response = await axiosClient.get(`/follow/${following_id}/following`, { params: { pages } });
    return response.data;
};

export const getFollowerList = async (follower_id: number, pages: number): Promise<ResponseBody<User[]>> => {
    // const formData = new FormData();
    // formData.append("follower_id", follower_id.toString());
    // formData.append("pages", pages.toString());
    const response = await axiosClient.get(`/follow/${follower_id}/follower`, { params: { pages } });
    return response.data;
};

export const followingCount = async (following_id: number): Promise<ResponseBody<number>> => {
    // const formData = new FormData();
    // formData.append("following_id", following_id.toString());
    const response = await axiosClient.get(`/follow/${following_id}/following/count`);
    return response.data;
}

export const followerCount = async (follower_id: number): Promise<ResponseBody<number>> => {
    const response = await axiosClient.get(`/follow/${follower_id}/follower/count`);
    return response.data;
}