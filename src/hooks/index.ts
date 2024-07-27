import { ResponseBody } from "@/types";

export * from "./usePosts";
export * from "./useUsers";
export * from "./useComments";
export * from "./useLikes";
export * from "./useFollow";
export * from "./usePrivacySetting";
export * from "./useMessages";
export * from "./useChat";
export * from "./useFCM";

export type ResponseHandlerType<T> = {
    onSuccess?: (data: ResponseBody<T>) => void;
    onError?: (error: Error) => void
}