import { FollowList, ResponseBody } from "@/types";
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

export const getFollowingList = async (following_id: number, pages: number): Promise<ResponseBody<FollowList>> => {
    // const formData = new FormData();
    // formData.append("following_id", following_id.toString());
    // formData.append("pages", pages.toString());
    const response = await axiosClient.get(`/follow/following`, { params: { following_id, pages } });
    return response.data;
};

export const getFollowerList = async (follower_id: number, pages: number): Promise<ResponseBody<FollowList>> => {
    // const formData = new FormData();
    // formData.append("follower_id", follower_id.toString());
    // formData.append("pages", pages.toString());
    const response = await axiosClient.get(`/follow/follower`, { params: { follower_id, pages } });
    return response.data;
};

export const followingCount = async (following_id: number): Promise<ResponseBody<number>> => {
    // const formData = new FormData();
    // formData.append("following_id", following_id.toString());
    const response = await axiosClient.get(`/follow/following/count`, { params: { following_id } });
    return response.data;
}