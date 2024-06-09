import { addComment } from "@/services";
import { ResponseBody } from "@/types";
import { useMutation } from "@tanstack/react-query";
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