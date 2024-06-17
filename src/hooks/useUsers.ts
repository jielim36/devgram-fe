import { USER_QUERY_KEY } from '@/constants';
import { getMe, getUserByUserId, getUsers } from '@/services';
import { ResponseBody, User } from '@/types';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryFunctionContext,
} from '@tanstack/react-query'

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

export const useGetUserByUserId = (userId: number) => {
    return useQuery({
        queryKey: USER_QUERY_KEY.concat(userId.toString()),
        queryFn: fetchUserByUserId,
    });
}