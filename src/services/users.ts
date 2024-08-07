import { SearchUser, UpdateUserInfo, User, UserInfo } from "@/types/User";
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

export const updateUserInfo = async (updateUserInfo: UpdateUserInfo): Promise<ResponseBody<UpdateUserInfo>> => {
    const response = await axiosClient.put(`/user/${updateUserInfo.userInfoEntity?.user_id}/info`, updateUserInfo);
    return response.data;
};

export const getSearchUserWithPagination = async (page: number, searchValue: string): Promise<ResponseBody<SearchUser>> => {
    const response = await axiosClient.get(`/user/search`, {
        params: {
            value: searchValue,
            page: page,
        }
    }
    );
    return response.data;
}

export const uploadAvatar = async (avatar: Blob): Promise<ResponseBody<boolean>> => {
    const formData = new FormData();
    formData.append("avatarImg", avatar);

    const response = await axiosClient.post(`/user/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}