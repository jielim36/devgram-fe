import { ResponseBody } from "@/types";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query"
import { ResponseHandlerType } from ".";
import { follow, followerCount, followingCount, getFollowerList, getFollowingList, isFollowing, unFollow } from "@/services";
import { FOLLOW_QUERY_KEY } from "@/constants";

const fetchIsFollowing = async (context: QueryFunctionContext<string[]>): Promise<ResponseBody<boolean>> => {
    const [_, follower_id, following_id] = context.queryKey;
    return await isFollowing(Number(follower_id), Number(following_id));
};

export const useIsFollowing = ({ follower_id, following_id, enabled }: { follower_id: number, following_id: number, enabled: boolean }) => {
    return useQuery({
        queryKey: FOLLOW_QUERY_KEY.concat(follower_id.toString(), following_id.toString()),
        queryFn: fetchIsFollowing,
        enabled: enabled
    });
}

export const useAddFollow = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (data: { follower_id: number, following_id: number }) => {
            return await follow(data.follower_id, data.following_id);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useUnFollow = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (data: { follower_id: number, following_id: number }) => {
            return await unFollow(data.follower_id, data.following_id);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useGetFollowingCount = ({ following_id }: { following_id: number }) => {
    return useQuery({
        queryKey: FOLLOW_QUERY_KEY.concat(following_id.toString(), "followingCount"),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, following_id] = context.queryKey;
            return await followingCount(Number(following_id));
        }
    });
}

export const useGetFollowerCount = ({ follower_id }: { follower_id: number }) => {
    return useQuery({
        queryKey: FOLLOW_QUERY_KEY.concat(follower_id.toString(), "followerCount"),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, follower_id] = context.queryKey;
            return await followerCount(Number(follower_id));
        }
    });
}

export const useGetFollowingList = ({ following_id, pages, enabled }: { following_id: number, pages: number, enabled: boolean }) => {
    return useQuery({
        queryKey: FOLLOW_QUERY_KEY.concat(following_id.toString(), pages.toString(), "followingList"),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, following_id, pages] = context.queryKey;
            return await getFollowingList(Number(following_id), Number(pages));
        },
        enabled: enabled
    });
}

export const useGetFollowerList = ({ follower_id, pages, enabled }: { follower_id: number, pages: number, enabled: boolean }) => {
    return useQuery({
        queryKey: FOLLOW_QUERY_KEY.concat(follower_id.toString(), pages.toString(), "followerList"),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, follower_id, pages] = context.queryKey;
            return await getFollowerList(Number(follower_id), Number(pages));
        },
        enabled: enabled
    });
}