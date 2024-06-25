import { ResponseBody } from "@/types";
import { PrivacySetting } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const getPrivacySettingByUserId = async (userId: number): Promise<ResponseBody<PrivacySetting>> => {
    const response = await axiosClient.get(`/settings/privacy/${userId}`);
    return response.data;
}

export const updatePirvacySettingByUserId = async (userId: number, privacySetting: PrivacySetting): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.put(`/settings/privacy/${userId}`, privacySetting);
    return response.data;
}