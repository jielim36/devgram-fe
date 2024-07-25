import { useGetChatRooms } from "@/hooks";
import { Chat } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { Message } from "@/types";
import { useAuth } from "./AuthProvider";
import { pusherChattingClient as pusherClient } from "./pusherClient";

type ChattingProviderProps = {
    children: React.ReactNode;
}

type ChattingProviderState = {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
}

const initialState: ChattingProviderState = {
    messages: [],
    setMessages: () => null,
    chats: [],
    setChats: () => null,
}

export const ChattingContext = createContext<ChattingProviderState>(initialState);

export const ChattingProvider: React.FC<ChattingProviderProps> = ({ children }) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const { user: me } = useAuth();

    // Initialize chat rooms
    const { data: chatRooms } = useGetChatRooms({ enabled: !!me?.id });

    useEffect(() => {
        if (chatRooms?.data) {
            setChats(chatRooms.data);
        }
    }, [chatRooms]);

    useEffect(() => {
        if (!me || !me?.id) return;

        const channelName = `chat.${me.id}`;
        pusherClient.subscribe(channelName)
            .bind("incoming-msg", (data: Message) => {
                const message: Message = data;
                const newMessageList = [...messages, message];
                setMessages(newMessageList);
                setChats((prevChats) => {
                    const chatIndex = prevChats.findIndex((chat) => chat.id === message.chat_id);
                    if (chatIndex !== -1) {
                        const updatedChats = [...prevChats];
                        const updatedChat = { ...updatedChats[chatIndex], latestMessage: message };
                        if (updatedChat.unread_count !== undefined) {
                            updatedChat.unread_count += 1;
                        }
                        updatedChats[chatIndex] = updatedChat;
                        return updatedChats.sort((a, b) => {
                            if (a.latestMessage?.created_at && b.latestMessage?.created_at) {
                                return new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime();
                            }
                            return 0;
                        });
                    }
                    return prevChats;
                });
            });

        return () => {
            pusherClient.unsubscribe(channelName);
        }
    }, [me, messages]);

    const value = {
        messages,
        setMessages,
        chats,
        setChats,
    }

    return (
        <ChattingContext.Provider value={value}>
            {children}
        </ChattingContext.Provider>
    );
}

export const useChatting = () => {
    const context = useContext(ChattingContext);

    if (!context) {
        throw new Error("useChatting must be used within ChattingProvider");
    }

    return context;
}
