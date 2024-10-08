import { queryClient } from '@/app/App';
import { USER_QUERY_KEY } from '@/constants';
import { getMe, getSearchUserWithPagination, getUserByUserId, getUserInfoByUserId, getUsers, updateUserInfo, uploadAvatar } from '@/services';
import { ResponseBody, UpdateUserInfo, User, UserInfo } from '@/types';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryFunctionContext,
} from '@tanstack/react-query'
import { ResponseHandlerType } from '.';
import { useAuth } from '@/utils/AuthProvider';

export const useUsers = () => useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => getUsers(),
});

export const useGetMe = ({ enabled = true }: { enabled?: boolean } = {}) => useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => await getMe(),
    enabled: enabled,
});

const fetchUserByUserId = async (context: QueryFunctionContext<string[]>): Promise<ResponseBody<User>> => {
    const [_, postId] = context.queryKey;
    return await getUserByUserId(Number(postId));
};

export const useGetUserByUserId = (userId: number, enabled?: boolean) => {
    return useQuery({
        queryKey: USER_QUERY_KEY.concat(userId.toString()),
        queryFn: fetchUserByUserId,
        enabled: enabled,
    });
}

export const useGetUserInfoByUserId = (userId: number, enabled?: boolean) => {
    return useQuery({
        queryKey: USER_QUERY_KEY.concat(userId.toString(), "info"),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, userId] = context.queryKey;
            return await getUserInfoByUserId(Number(userId));
        },
    });
}

export const useUpdateUserInfo = () => {
    const { user, setUser } = useAuth();

    return useMutation({
        mutationFn: async (data: { updateUserInfo: UpdateUserInfo }) => {
            return await updateUserInfo(data.updateUserInfo);
        },
        onMutate: async (data) => {
            return data;
        },
        onSuccess: async (data, variables, context) => {
            if (context?.updateUserInfo?.userInfoEntity) {
                queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY.concat(context?.updateUserInfo?.userInfoEntity.user_id.toString(), "info") });
                queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY.concat(context?.updateUserInfo?.userInfoEntity.user_id.toString()) });

                queryClient.setQueryData(
                    USER_QUERY_KEY.concat(context.updateUserInfo.userInfoEntity.user_id.toString(), "info"),
                    (oldData: UserInfo) => ({
                        ...oldData,
                        data: data,
                    })
                    // update username only
                );
                if (user && context.updateUserInfo.username) {
                    setUser({
                        ...user,
                        username: context.updateUserInfo.username
                    })
                }
            }
        },
        onError: async (error, variables, context) => {
        },
    });
}

export const useGetSearchUsers = ({ enabled, searchValue, page }: { enabled: boolean, searchValue: string, page: number }) => {
    return useQuery({
        queryKey: USER_QUERY_KEY.concat("search", searchValue, page.toString()),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, search, searchValue, page] = context.queryKey;
            return await getSearchUserWithPagination(Number(page), searchValue);
        },
        enabled: enabled
    });
}

export const useUploadAvatar = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (data: { imgBlob: Blob }) => {
            return await uploadAvatar(data.imgBlob);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}