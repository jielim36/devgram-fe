import { User, UserInfo } from "@/types/User";
import axiosClient from "@/utils/axiosClient";
import { ResponseBody } from "@/types";

export const getUsers = async (): Promise<ResponseBody<User>> => {
    const response = await axiosClient.get("/users");
    return response.data;
};

export const getMe = async (): Promise<ResponseBody<User>> => {
    const response = await axiosClient.get("/user/me");
    return response.data;
};

export const getUserByUserId = async (userId: number): Promise<ResponseBody<User>> => {
    const response = await axiosClient.get(`/user/${userId}`);
    return response.data;
};

export const getUserInfoByUserId = async (userId: number): Promise<ResponseBody<UserInfo>> => {
    const response = await axiosClient.get(`/user/${userId}/info`);
    return response.data;
}