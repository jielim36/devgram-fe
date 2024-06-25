import { POST_QUERY_KEY } from "@/constants";
import { addPost, deletePost, getFollowingPostWithPagination, getFollowingPosts, getPopularPostWithPagination, getPopularPosts, getPostByPostId, getPostsByUserId, updatePostDescription } from "@/services";
import { Post, ResponseBody } from "@/types";
import {
    useQuery,
    useMutation,
    QueryFunctionContext,
    useInfiniteQuery,
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

export const useGetFollowingPosts = (userId: number) => {
    return useQuery({
        queryKey: POST_QUERY_KEY.concat(userId.toString()),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, userId] = context.queryKey;
            return await getFollowingPosts(Number(userId));
        },
        enabled: !!userId
    });
}

export const useGetPopularPostsInfinite = ({ enabled }: { enabled: boolean }) => {
    return useInfiniteQuery({
        queryKey: POST_QUERY_KEY.concat("popular"),
        queryFn: async ({ pageParam = 1, queryKey }) => {
            return await getPopularPostWithPagination(pageParam);
        },
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages?.length + 1;
            return currentPage;
        },
        initialData: {
            pages: [],
            pageParams: [1]
        },
        initialPageParam: 1,
        enabled: enabled
    });
}

export const useGetFollowingPostsInfinite = ({ userId, enabled }: { userId: number, enabled: boolean }) => {
    return useInfiniteQuery({
        queryKey: POST_QUERY_KEY.concat(userId.toString(), "following"),
        queryFn: async ({ pageParam = 1, queryKey }) => {
            const [_, userId] = queryKey;
            return await getFollowingPostWithPagination(Number(userId), pageParam);
        },
        getNextPageParam: (lastPage, pages) => {
            return pages?.length + 1;
        },
        initialData: {
            pages: [],
            pageParams: [1]
        },
        initialPageParam: 1,
        enabled: enabled
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

export const useGetPostsByUserId = ({ userId, enabled }: { userId: number, enabled: boolean }) => useQuery({
    queryKey: POST_QUERY_KEY.concat(userId.toString()),
    queryFn: fetchPostsByUserId,
    enabled: enabled
});