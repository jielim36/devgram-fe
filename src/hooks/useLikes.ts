import axiosClient from "@/utils/axiosClient";
import { ResponseHandlerType } from ".";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { LIKE_QUERY_KEY } from "@/constants";
import { addLikeByPostId, removeLikeByPostId } from "@/services";

export const useAddLike = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (postId: number) => {
            return addLikeByPostId(postId);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useUnlike = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (postId: number) => {
            return removeLikeByPostId(postId);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}