import { FirebaseNotificationRequest, FirebaseSaveTokenRequest, ResponseBody } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const sendMessageNotification = async (message: FirebaseNotificationRequest): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post("/fcm/notification/message", message);
    return response.data;
}

export const saveFirebaseToken = async (tokenForm: FirebaseSaveTokenRequest): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post("/fcm/token", tokenForm);
    return response.data;
}