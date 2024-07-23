import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/utils/AuthProvider";
import { pusherClient } from "@/utils/pusherClient";
import { useAddMessage, useGetInitMessages } from "@/hooks";
import toast from "react-hot-toast";
import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import InputWithEmoji from "@/components/InputWithEmoji/InputWithEmoji";
import { Message, User } from "@/types";
import { late } from "zod";
import convertDate, { convertDateToReadableDate } from "@/utils/convertDateFormat";

type ChatRoomProps = {
    user: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user }) => {
    const { userId } = useParams();
    const { user: me } = useAuth();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const messagesRef = useRef<Message[]>(messages);
    const [latestReadChatIdByReceiver, setLatestReadChatIdByReceiver] = useState<number | null>(null);
    const { data: initMessageData, isSuccess: initMessageSuccess, isLoading: isInitLoading, isPending: isInitPending } = useGetInitMessages({
        user1_id: me!.id,
        user2_id: user.id,
        enabled: !!userId && !!me?.id
    });
    const addMessageMutation = useAddMessage({
        onSuccess: (data) => {
            setMessage("");
            setMessages([...messages, data.data]);
        },
    });

    useEffect(() => {
        messagesRef.current = messages;
        const latestReadChatId = messages.slice().reverse().find(msg => msg.is_read && msg.sender_id === me?.id)?.id || null
        console.log("latestReadChatId", latestReadChatId);

        setLatestReadChatIdByReceiver(latestReadChatId);
    }, [messages]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollAreaRef, messages]);

    useEffect(() => {
        if (!initMessageData) return;
        setMessages(initMessageData.data);
    }, [initMessageData]);

    useEffect(() => {
        if (!me?.id || !userId || !initMessageSuccess) return;

        const channelName = `chat.${me?.id}`;

        pusherClient.subscribe(channelName)
            .bind("incoming-msg", (data: Message) => {
                const message: Message = data;
                if (message.sender_id !== Number(userId)) return;
                const newMessageList = [...messagesRef.current, message];
                setMessages(newMessageList);
            });

        return () => {
            pusherClient.unsubscribe(channelName);
        }
    }, [userId, initMessageSuccess]);

    const handleSendMessage = () => {
        if (!message || message.length === 0) return;
        if (!me?.id) return;

        const newMessage: Message = {
            id: undefined,
            chat_id: undefined,
            sender_id: me?.id,
            receiver_id: user.id,
            content: message,
            is_read: false,
            created_at: undefined,
            updated_at: undefined
        }
        toast.promise(addMessageMutation.mutateAsync(newMessage), {
            loading: "Sending message...",
            success: "Message sent!",
            error: "Failed to send message!"
        });
    }

    const compareMessageTimeDifference = (message: Message, index: number): number => {
        // compare current message with previous message, return time difference with minutes
        if (index === 0) return 0;
        const previousMessage = messages[index - 1];
        const currentMessageTime = new Date(message.created_at ?? "").getTime();
        const previousMessageTime = previousMessage.created_at ? new Date(previousMessage.created_at).getTime() : 0;
        const timeDifference = currentMessageTime - previousMessageTime;
        const minutesDifference = Math.floor(timeDifference / 1000 / 60);
        return minutesDifference;
    }

    if (!userId || !me) return null;

    if (isInitLoading || isInitPending) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Icon name="loader-circle" className="animate-spin text-muted-foreground h-12 w-12" />;
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex flex-row items-center py-2 px-4 gap-2">
                <AvatarContainer avatar_url={user.avatar_url} hasStory={true} className="h-fit" />
                <div className="flex flex-col">
                    <p className="font-semibold">{user.username}</p>
                    <div className="flex flex-row gap-1 items-center">
                        <div className="bg-green-500 h-2 w-2 rounded-full" />
                        <p className="text-xs">Online</p>
                    </div>
                </div>
            </div>
            <Separator />

            <ScrollArea className="grow">
                <div ref={scrollAreaRef} className="h-full flex flex-col gap-1 p-4 justify-end">
                    {messages?.length > 0 && messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`group w-full ${index !== 0 && message.sender_id !== messages[index - 1].sender_id && compareMessageTimeDifference(message, index) < 10 ? "mt-6" : ""}`}>
                            {compareMessageTimeDifference(message, index) >= 10 && message?.created_at && (
                                <div className="flex justify-center items-center gap-3 overflow-hidden py-4 opacity-70">
                                    <Separator />
                                    <p className="text-muted-foreground text-xs whitespace-nowrap">{convertDateToReadableDate(message?.created_at)}</p>
                                    <Separator />
                                </div>
                            )}
                            <div className={`max-w-[70%] w-fit flex gap-1 items-center ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"} ${message.sender_id === me.id ? "float-right" : ""}`}>
                                <div className={`flex gap-1 items-start ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"}`}>
                                    <AvatarContainer
                                        avatar_url={message.sender_id === me.id ? me.avatar_url : user.avatar_url}
                                        hasStory={false}
                                        className={`${index !== 0 && message.sender_id === messages[index - 1].sender_id && compareMessageTimeDifference(message, index) < 10 ? "opacity-0" : ""}`}
                                    />
                                    <div className={`flex flex-col gap-1 ${message.sender_id === me.id ? "items-end" : ""}`}>
                                        <div className="px-3 py-2 border w-fit rounded-md font-normal break-all whitespace-pre-wrap">
                                            {message.content}
                                        </div>
                                        {message.id === latestReadChatIdByReceiver && (
                                            <span className={`text-muted-foreground text-xs px-2`}>Seen</span>
                                        )}
                                    </div>
                                </div>
                                <Popover>
                                    <PopoverTrigger>
                                        <div className={`opacity-0 group-hover:opacity-100 cursor-pointer px-2 m-auto`}>
                                            <Icon name="ellipsis" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex flex-col min-w-0 w-fit p-0">
                                        <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                            <Icon name="reply" />
                                            <p>Reply</p>
                                        </div>
                                        <Separator />
                                        <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                            <Icon name="laugh" />
                                            <p>React</p>
                                        </div>
                                        <Separator />
                                        <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                            <Icon name="pencil" />
                                            <p>Edit</p>
                                        </div>
                                        <Separator />
                                        <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                            <Icon name="trash-2" />
                                            <p>Delete</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea >

            <Separator />
            <div className="pl-4 pr-2 py-2 flex flex-row items-center gap-1">
                <div className="grow">
                    <InputWithEmoji
                        content={message}
                        setContent={setMessage}
                        containerClassName="m-0"
                        textAreaClassName="resize-none min-h-4 max-h-12"
                    />
                </div>
                <Button className="" variant={"ghost"} onClick={handleSendMessage}>
                    <Icon name="send-horizontal" className="" />
                </Button>
            </div >
        </div >
    );
}

export default ChatRoom;
