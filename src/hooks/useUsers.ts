import { USER_QUERY_KEY } from '@/constants';
import { getMe, getUsers } from '@/services';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'

export const useUsers = () => useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => getUsers(),
});

export const useGetMe = () => useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => getMe(),
});