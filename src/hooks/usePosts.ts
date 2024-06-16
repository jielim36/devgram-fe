import { POST_QUERY_KEY } from "@/constants";
import { addPost, deletePost, getPopularPosts, getPostByPostId, getPostsByUserId, updatePostDescription } from "@/services";
import { Post, ResponseBody } from "@/types";
import {
    useQuery,
    useMutation,
    QueryFunctionContext,
} from '@tanstack/react-query'
import { ResponseHandlerType } from ".";

export const useAddPost = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            // mutationKey: POST_QUERY_KEY,
            mutationFn: async (data: { description: string, imgBlobArray: Blob[] }) => {
                return await addPost(data.description, data.imgBlobArray);
            },
            onSuccess: onSuccess,
            onError: onError
        });
};

export const useDeletePost = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            mutationFn: async (postId: number) => {
                return await deletePost(postId);
            },
            onSuccess: onSuccess,
            onError: onError
        });
}

export const useUpdatePostDescription = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            mutationFn: async (data: { postId: number, description: string }) => {
                return await updatePostDescription(data.postId, data.description);
            },
            onSuccess: onSuccess,
            onError: onError
        });
}

export const useGetPopularPosts = () => {
    return useQuery({
        queryKey: POST_QUERY_KEY,
        queryFn: async () => {
            return await getPopularPosts();
        },
    });
}

const fetchPostByPostId = async (context: QueryFunctionContext<string[]>): Promise<ResponseBody<Post>> => {
    const [_, postId] = context.queryKey;
    return await getPostByPostId(Number(postId));
};

export const useGetPostByPostId = (postId: number) => useQuery({
    queryKey: POST_QUERY_KEY.concat(postId.toString()),
    queryFn: fetchPostByPostId
});

const fetchPostsByUserId = async (context: QueryFunctionContext<string[]>): Promise<ResponseBody<Post[]>> => {
    const [_, userId] = context.queryKey;
    return await getPostsByUserId(Number(userId));
}

export const useGetPostsByUserId = (userId: number) => useQuery({
    queryKey: POST_QUERY_KEY.concat(userId.toString()),
    queryFn: fetchPostsByUserId
});