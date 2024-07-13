import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { ResponseHandlerType } from ".";
import { ReelRequestBody } from "@/types";
import { addReel, getPopularReels } from "@/services/reel";
import { REEL_QUERY_KEY } from "@/constants";

export const useAddReel = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async (data: { reelRequestBody: ReelRequestBody }) => {
            return await addReel(data.reelRequestBody);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useGetPopularReels = ({ enabled, page }: { enabled: boolean, page: number }) => {
    // return useInfiniteQuery({
    //     queryKey: REEL_QUERY_KEY.concat("popular"),
    //     queryFn: async ({ pageParam = 1, queryKey }) => {
    //         return await getPopularReels(pageParam);
    //     },
    //     getNextPageParam: (lastPage, pages) => {
    //         const currentPage = pages?.length + 1;
    //         return currentPage;
    //     },
    //     initialData: {
    //         pages: [],
    //         pageParams: [1]
    //     },
    //     initialPageParam: 1,
    //     enabled: enabled
    // });
    return useQuery({
        queryKey: REEL_QUERY_KEY.concat("popular", page.toString()),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, popularKey, page] = context.queryKey;
            return await getPopularReels(Number(page));
        },
        enabled: enabled
    });
}