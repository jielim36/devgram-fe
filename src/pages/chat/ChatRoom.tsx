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
    const { data: initMessageData, isSuccess: initMessageSuccess } = useGetInitMessages({
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

    if (!userId || !me) return null;

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
                <div ref={scrollAreaRef} className="h-full flex flex-col gap-4 p-4 justify-end">
                    {messages?.length > 0 && messages.map((message, index) => (
                        <div key={message.id} className={`group w-full`}>
                            <div className={`max-w-[70%] w-fit flex gap-1 items-center ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"} ${message.sender_id === me.id ? "float-right" : ""}`}>
                                <div className={`flex gap-1 items-start ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"}`}>
                                    <AvatarContainer avatar_url={message.sender_id === me.id ? me.avatar_url : user.avatar_url} hasStory={false} className={`${index !== 0 && message.sender_id === messages[index - 1].sender_id ? "opacity-0" : ""}`} />
                                    <div className="px-3 py-2 border w-fit rounded-md font-normal break-all whitespace-pre-wrap">
                                        {message.content}
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
