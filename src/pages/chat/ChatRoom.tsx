import React, { UIEvent, useEffect, useRef, useState } from "react";
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
import { useAddMessage, useAddMessageReaction, useDeleteMessage, useGetInitMessages, useUpdateIsRead, useUpdateMessageContent } from "@/hooks";
import toast from "react-hot-toast";
import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import InputWithEmoji from "@/components/InputWithEmoji/InputWithEmoji";
import { Chat, Message, User } from "@/types";
import { late } from "zod";
import convertDate, { convertDateToReadableDate, formatTo12HourTime } from "@/utils/convertDateFormat";
import { set } from "date-fns";
import DeleteMessageDialog from "./DeleteMessageDialog";
import ReactMessageSelectionBar from "./ReactMessageSelectionBar";
import MessageSelectionMenu from "./MessageSelectionMenu";
import { Card } from "@/components/ui/card";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { useChatting } from "@/utils/ChattingProvider";

type ChatRoomProps = {
    user: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user }) => {
    const { userId } = useParams();
    const { user: me } = useAuth();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const messagesRef = useRef<Message[]>(messages);
    const [replyMessageId, setReplyMessageId] = useState<number | undefined>(undefined);
    const [latestReadMessageIdByReceiver, setLatestReadMessageIdByReceiver] = useState<number | null>(null);
    const [openMessageSelectionMenuIndex, setOpenMessageSelectionMenuIndex] = useState<number>(-1);
    const { chats, setChats } = useChatting();
    const { data: initMessageData, isSuccess: initMessageSuccess, isLoading: isInitLoading, isPending: isInitPending } = useGetInitMessages({
        user1_id: me!.id,
        user2_id: user.id,
        enabled: !!userId && !!me?.id
    });
    const addMessageMutation = useAddMessage({
        onSuccess: (data) => {
            setMessage("");
            setMessages([...messages, data.data]);
            setReplyMessageId(undefined);
        },
    });
    const useUpdateIsReadMutation = useUpdateIsRead({
        onSuccess: (data) => {
        }
    });
    const useDeleteMessageMutation = useDeleteMessage({
        onSuccess: () => { }
    });
    const useAddMessageReactionMutation = useAddMessageReaction({
        onSuccess: (data) => { }
    });
    const useUpdateMessageContentMutation = useUpdateMessageContent({
        onSuccess: (data) => { }
    });

    useEffect(() => {
        messagesRef.current = messages;
        const latestReadChatId = messages.slice().reverse().find(msg => msg.is_read && msg.sender_id === me?.id)?.id || null
        setLatestReadMessageIdByReceiver(latestReadChatId);

        // set unread_count to 0
        if (currentChatId) {
            const newChats = chats.map(chat => {
                if (chat.id === currentChatId) {
                    return { ...chat, unread_count: 0 };
                }
                return chat;
            });
            setChats(newChats);
        }

    }, [messages]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollAreaRef, messages]);

    useEffect(() => {
        if (!initMessageData) return;
        setMessages(initMessageData.data);
        if (initMessageData.data.length > 0 && initMessageData.data[0]?.chat_id) {
            setCurrentChatId(initMessageData.data[0]?.chat_id);
            useUpdateIsReadMutation.mutate({ chatId: initMessageData.data[0]?.chat_id, receiverId: Number(userId) });
        }
    }, [initMessageData]);

    useEffect(() => {
        if (!userId) return;
        const targetChatRoom = chats?.find(chat => chat.user1.id === Number(userId) || chat.user2.id === Number(userId));
        if (!targetChatRoom?.id) return;
        setCurrentChatId(targetChatRoom.id);
    }, [userId])

    // Bind all chat real-time events
    useEffect(() => {
        if (!me?.id || !userId || !initMessageSuccess) return;
        if (!currentChatId) return;

        const channelName = `chat.${me?.id}`;
        const receiveMsgEvent = "incoming-msg";
        const deleteReceiveMsgEvent = "delete-msg";
        const receiveReadEvent = "read-msg";
        const receiveReactionEvent = "reaction-msg";
        const receiveUpdateContentEvent = "content-msg";

        pusherClient.subscribe(channelName);
        pusherClient.bind(receiveMsgEvent, (data: Message) => {
            const message: Message = data;
            if (message.sender_id !== Number(userId) && message.chat_id !== currentChatId) return;

            const newMessageList = [...messagesRef.current, message];
            setMessages(newMessageList);
            // update is_read status of the receiving message at sender side
            if (Number(userId) && message.chat_id) {
                useUpdateIsReadMutation.mutate({ chatId: message.chat_id, receiverId: message.sender_id });
            }
        });
        pusherClient.bind(deleteReceiveMsgEvent, (data: number) => {
            if (data != null) {
                deleteMessageByIdInChatRoom(data);
            }
        });

        const handleReceiveReadEvent = (data: number) => {
            if (data != null && data === currentChatId) {
                const updateReadMsgs = messages.map(msg => {
                    if (msg.sender_id === me?.id) {
                        return { ...msg, is_read: true };
                    }
                    return msg;
                });
                setMessages(updateReadMsgs);

                const myMsgs = messages.filter(msg => msg.sender_id === me?.id);
                const latestSentMsgId = myMsgs[myMsgs.length - 1]?.id;
                if (!latestSentMsgId) return;

                setLatestReadMessageIdByReceiver(latestSentMsgId);
            }
        };
        pusherClient.bind(receiveReadEvent, handleReceiveReadEvent);

        pusherClient.bind(receiveReactionEvent, (data: Message) => {
            const message: Message = data;
            const updatedMessages = messages.map(msg => {
                if (msg.id === message.id) {
                    return { ...msg, reaction: message.reaction };
                }
                return msg;
            });
            setMessages(updatedMessages);
        });

        pusherClient.bind(receiveUpdateContentEvent, (data: Message) => {
            const message: Message = data;
            const updatedMessages = messages.map(msg => {
                if (msg.id === message.id) {
                    return { ...msg, content: message.content };
                }
                return msg;
            });
            setMessages(updatedMessages);
        });

        return () => {
            pusherClient.unsubscribe(channelName);
            pusherClient.unbind(receiveMsgEvent);
            pusherClient.unbind(deleteReceiveMsgEvent);
            pusherClient.unbind(receiveReadEvent);
            pusherClient.unbind(receiveReactionEvent);
            pusherClient.unbind(receiveUpdateContentEvent);
        }
    }, [userId, initMessageSuccess, messages, currentChatId]);

    const deleteMessageByIdInChatRoom = (messageId: number) => {
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        setMessages(updatedMessages);
    }

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
            refer_msg_id: replyMessageId,
            created_at: undefined,
            updated_at: undefined
        }
        toast.promise(addMessageMutation.mutateAsync(newMessage), {
            loading: "Sending message...",
            success: "Message sent!",
            error: "Failed to send message!"
        });
    }

    const handleDeleteMessage = (message: Message) => {
        toast.promise(useDeleteMessageMutation.mutateAsync(message), {
            loading: "Deleting message...",
            success: "Message deleted!",
            error: "Failed to delete message!"
        }).then((data) => {
            if (data?.data) {
                if (!message.id) return;
                deleteMessageByIdInChatRoom(message?.id);
            }
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

    const onAddReaction = (reaction: string, messageId: number) => {
        const message = messages.find(msg => msg.id === messageId);
        if (!message) return;
        const newMessage = { ...message, reaction: reaction };
        toast.promise(useAddMessageReactionMutation.mutateAsync(newMessage), {
            loading: "Adding reaction...",
            success: "Reaction added!",
            error: "Failed to add reaction!"
        }).then((data) => {
            if (data?.data) {
                const updatedMessages = messages.map(msg => {
                    if (msg.id === messageId) {
                        return { ...msg, reaction: reaction };
                    }
                    return msg;
                });
                setMessages(updatedMessages);
            }
        });
    }

    const onUpdateMessageContent = (message: Message) => {
        toast.promise(useUpdateMessageContentMutation.mutateAsync(message), {
            loading: "Updating message...",
            success: "Message updated!",
            error: "Failed to update message!"
        }).then((data) => {
            if (data?.data) {
                const updatedMessages = messages.map(msg => {
                    if (msg.id === message.id) {
                        return { ...msg, content: message.content };
                    }
                    return msg;
                });
                setMessages(updatedMessages);
            }
        });
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

            <ScrollArea className="grow" isDisabledScroll={openMessageSelectionMenuIndex !== -1}>
                <div ref={scrollAreaRef} className="h-full flex flex-col gap-1 p-4 justify-end">
                    {messages?.length > 0 && messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`group w-full 
                                    ${index !== 0 && message.sender_id !== messages[index - 1].sender_id && compareMessageTimeDifference(message, index) < 10 ? "mt-6" : ""}
                                    ${message.reaction ? "mb-4" : ""}
                                    ${replyMessageId === message.id ? "bg-muted p-1 rounded-lg" : ""}
                                    `}
                        >
                            {compareMessageTimeDifference(message, index) >= 10 && message?.created_at && (
                                <div className="flex justify-center items-center gap-3 overflow-hidden py-4 opacity-70">
                                    <Separator />
                                    <p className="text-muted-foreground text-xs whitespace-nowrap">{convertDateToReadableDate(message?.created_at)}</p>
                                    <Separator />
                                </div>
                            )}
                            <div className={`max-w-[70%] w-fit flex gap-1 items-center 
                                ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"} 
                                ${message.sender_id === me.id ? "float-right" : ""}
                                `}
                            >
                                <div className={`flex gap-1 items-end ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"}`}>
                                    <AvatarContainer
                                        avatar_url={message.sender_id === me.id ? me.avatar_url : user.avatar_url}
                                        hasStory={false}
                                        className={`hidden lg:block ${index !== 0 && message.sender_id === messages[index - 1].sender_id && compareMessageTimeDifference(message, index) < 10 ? "opacity-0" : ""}`}
                                    />
                                    <Card className={`relative flex flex-col gap-1 ${message.sender_id === me.id ? "items-end" : ""}`}>
                                        {/* Refer message */}
                                        {message.refer_msg_id &&
                                            <div className="p-1 h-full w-full">
                                                <div className="bg-muted py-1 px-2 w-full rounded-md font-xs break-all whitespace-nowrap truncate ">
                                                    {messages.find(msg => msg.id === message.refer_msg_id)?.content}
                                                </div>
                                            </div>
                                        }
                                        <div className={`px-3 pb-2 ${message.refer_msg_id ? "" : "pt-2"} flex flex-row gap-2 items-end`}>
                                            <div className="w-fit rounded-md font-normal break-all whitespace-pre-wrap">
                                                {message.content}
                                            </div>
                                            <div className="flex flex-row justify-center items-center gap-[2px]">
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTo12HourTime(message.created_at ?? "")}
                                                </p>
                                                {message.sender_id === me.id && (
                                                    message.is_read ?
                                                        <CheckCheckIcon width={12} height={12} className={`${message.is_read ? "text-blue-500" : "text-muted-foreground"}`} />
                                                        :
                                                        <CheckIcon width={12} height={12} className={`${message.is_read ? "text-blue-500" : "text-muted-foreground"}`} />
                                                )}
                                            </div>
                                        </div>
                                        {message.reaction && (
                                            <Card className={`absolute -bottom-4 ${message.sender_id === me.id ? "right-2" : "left-2"} p-[2px] rounded-full animate-spinner-grow`}>
                                                <p className="text-xs text-muted-foreground">{message.reaction}</p>
                                            </Card>
                                        )}
                                    </Card>
                                    {message.id === latestReadMessageIdByReceiver && (
                                        <p className="text-xs text-muted-foreground py-1">
                                            Seen
                                        </p>
                                    )}
                                </div>
                                <MessageSelectionMenu
                                    index={index}
                                    isMe={message.sender_id === me.id}
                                    message={message}
                                    onDelete={handleDeleteMessage}
                                    onAddReaction={onAddReaction}
                                    onUpdateMessageContent={onUpdateMessageContent}
                                    setReplyMessageId={setReplyMessageId}
                                    setIsOpenMessageSelectionMenu={setOpenMessageSelectionMenuIndex}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea >

            <Separator />
            <div className="flex flex-col pl-4 pr-2 py-2 gap-1">
                {replyMessageId && (
                    <div className="relative mx-2 pr-2 flex flex-row gap-2 items-center bg-muted rounded-md overflow-hidden text-nowrap">
                        <div className="w-1 bg-muted-foreground h-full" />
                        <div className="flex flex-row w-full py-2 gap-1 overflow-hidden">
                            <p className="text-muted-foreground">Replying to:</p>
                            <p className="text-muted-foreground truncate break-all">{messages.find(msg => msg.id === replyMessageId)?.content}</p>
                        </div>
                        {/* Cancel Button */}
                        <div className="absolute top-0 right-0 p-[1px] cursor-pointer" onClick={() => setReplyMessageId(undefined)}>
                            <Icon name="x" className="text-muted-foreground" width={16} height={16} />
                        </div>
                    </div>
                )}
                <div className="flex flex-row items-center gap-1">
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
            </div>
        </div >
    );
}

export default ChatRoom;
