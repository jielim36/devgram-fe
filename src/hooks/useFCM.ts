import { saveFirebaseToken, sendMessageNotification } from "@/services";
import { FirebaseNotificationRequest, FirebaseSaveTokenRequest } from "@/types";
import { useMutation } from "@tanstack/react-query"
import { ResponseHandlerType } from ".";

export const useSendMessageNotification = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (message: FirebaseNotificationRequest) => {
            const response = await sendMessageNotification(message);
            return response;
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useSaveFirebaseToken = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (tokenForm: FirebaseSaveTokenRequest) => {
            const response = await saveFirebaseToken(tokenForm);
            return response;
        },
        onSuccess: onSuccess,
        onError: onError
    });
}