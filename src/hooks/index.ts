import { ResponseBody } from "@/types";

export * from "./usePosts";
export * from "./useUsers";
export * from "./useComments";
export * from "./useLikes";
export * from "./useFollow";

export type ResponseHandlerType<T> = {
    onSuccess?: (data: ResponseBody<T>) => void;
    onError?: (error: Error) => void
}