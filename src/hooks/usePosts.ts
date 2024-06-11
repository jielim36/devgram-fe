import { POST_QUERY_KEY } from "@/constants";
import { addPost, getPopularPosts } from "@/services";
import { ResponseBody } from "@/types";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { ResponseHandlerType } from ".";

export const useAddPost = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation(
        {
            // mutationKey: POST_QUERY_KEY,
            mutationFn: async (data: { description: string, imgBlobArray: Blob[] }) => {
                return addPost(data.description, data.imgBlobArray);
            },
            onSuccess: onSuccess,
            onError: onError
        });
};

export const useGetPopularPosts = () => {
    return useQuery({
        queryKey: POST_QUERY_KEY,
        queryFn: async () => {
            return await getPopularPosts();
        }
    });
}