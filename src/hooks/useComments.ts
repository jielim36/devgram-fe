import { addComment, deleteComment } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ResponseHandlerType } from ".";

export const useAddComment = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            mutationFn: async (data: { postId: number, parentId: number, content: string }) => {
                return addComment(data.postId, data.parentId, data.content);
            },
            onSuccess: onSuccess,
            onError: onError
        });
}

export const useDeleteComment = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            mutationFn: async (commentId: number) => {
                return deleteComment(commentId);
            },
            onSuccess: onSuccess,
            onError: onError
        });
}