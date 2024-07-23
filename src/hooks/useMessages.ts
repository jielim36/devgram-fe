import { Chat, ChatRequest, Message } from "@/types";
import { ResponseHandlerType } from ".";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";
import { addMessage, initMessages } from "@/services";
import { MESSAGE_QUERY_KEY } from "@/constants";

export const useAddMessage = ({ onSuccess, onError }: ResponseHandlerType<Message>) => {
    return useMutation({
        mutationFn: async (message: Message) => {
            return await addMessage(message);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useGetInitMessages = ({ user1_id, user2_id, enabled }: { user1_id: number, user2_id: number, enabled: boolean }) => {
    return useQuery({
        queryKey: MESSAGE_QUERY_KEY.concat([user1_id.toString(), user2_id.toString()]),
        queryFn: async (context: QueryFunctionContext<string[]>) => {
            const [_, user1_id, user2_id] = context.queryKey;
            const chat: ChatRequest = {
                user1_id: parseInt(user1_id),
                user2_id: parseInt(user2_id)
            }
            return await initMessages(chat);
        },
        enabled: enabled
    });
}
