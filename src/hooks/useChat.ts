import { CHAT_QUERY_KEY } from "@/constants";
import { getChatRooms } from "@/services";
import { useQuery } from "@tanstack/react-query"

export const useGetChatRooms = ({ enabled }: { enabled: boolean }) => {
    return useQuery({
        queryKey: CHAT_QUERY_KEY,
        queryFn: async () => {
            return await getChatRooms();
        },
        enabled: enabled
    });
}