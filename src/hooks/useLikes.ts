import axiosClient from "@/utils/axiosClient";
import { ResponseHandlerType } from ".";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { LIKE_QUERY_KEY } from "@/constants";
import { likeComment, likePost, unlikeComment, unlikePost } from "@/services";

export const useLikePost = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (postId: number) => {
            return likePost(postId);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useUnlikePost = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (postId: number) => {
            return unlikePost(postId);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useLikeComment = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (commentId: number) => {
            return likeComment(commentId);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useUnlikeComment = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (commentId: number) => {
            return unlikeComment(commentId);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}