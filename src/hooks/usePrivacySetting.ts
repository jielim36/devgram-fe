import { PrivacySetting, ResponseBody } from "@/types";
import {
    useQuery,
    useMutation,
    QueryFunctionContext,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { ResponseHandlerType } from ".";
import { PRIVACY_SETTING_QUERY_KEY } from "@/constants";
import { getPrivacySettingByUserId, updatePirvacySettingByUserId } from "@/services";

export const useGetPrivacySettingByUserId = ({ userId, enabled }: { userId: number, enabled: boolean }) => {
    return useQuery({
        queryKey: PRIVACY_SETTING_QUERY_KEY.concat(userId.toString()),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, userId] = context.queryKey;
            return await getPrivacySettingByUserId(Number(userId));
        },
        enabled: enabled
    });
}

export const useUpdatePrivacySettingByUserId = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            mutationFn: async (data: { userId: number, privacySetting: PrivacySetting }) => {
                return await updatePirvacySettingByUserId(data.userId, data.privacySetting);
            },
            onSuccess: onSuccess,
            onError: onError
        });
}