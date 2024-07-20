import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Chat as ChatType, Message, User } from "@/types";
import ChatRoom from "./ChatRoom";
import { useEffect, useState } from "react";
import ThemeToggleButton from "@/components/ThemeToggleButton/ThemeToggleButton";
import { useNavigate, useParams } from "react-router-dom";
import { useGetChatRooms, useGetUserByUserId } from "@/hooks";
import { useAuth } from "@/utils/AuthProvider";
import { useChatting } from "@/utils/ChattingProvider";
import toast from "react-hot-toast";

const Chat = () => {

    const { userId } = useParams();
    const { chats: chatRooms } = useChatting();
    const { user: me } = useAuth();
    const [chattingUser, setChattingUser] = useState<User>();
    const useGetUserByUserIdQuery = useGetUserByUserId(Number(userId), false);
    const navigate = useNavigate();

    const handlePreviousPage = () => {
        history.back();
    }

    const getChattingUserByPath = (): User | null => {
        if (!userId) return null;
        const targetChatRoom = chatRooms?.find(chat => chat.user1.id === Number(userId) || chat.user2.id === Number(userId));
        if (!targetChatRoom) return null;
        return targetChatRoom?.user1.id === Number(userId) ? targetChatRoom.user1 : targetChatRoom?.user2;
    }

    useEffect(() => {
        if (!userId) return;
        if (Number(userId) === me?.id) {
            toast.error("You can't chat with yourself.");
            navigate("/chat");
        }

        // delete temp chat room if user navigate to another chat room (delete chat room id = -1)
        chatRooms?.forEach((chat) => {
            if (chat.id === -1) {
                chatRooms.splice(chatRooms.indexOf(chat), 1);
            }
        });

        const user: User | null = getChattingUserByPath();
        if (user) {
            setChattingUser(user);
        } else {
            // if path jump to a user chat room that never chat before, generate a new temp chat room
            useGetUserByUserIdQuery.refetch().then((data) => {
                if (data?.data?.data) {
                    setChattingUser(data.data.data);
                    if (chatRooms.find(chat => chat.id === -1)) return;
                    const newMessage: Message = {
                        sender_id: me!.id,
                        receiver_id: Number(userId),
                        content: ""
                    }
                    const newChatRoom: ChatType = {
                        id: -1,
                        user1: me!,
                        user2: data.data.data,
                        unread_count: 0,
                        latestMessage: newMessage,
                    };
                    chatRooms?.unshift(newChatRoom);
                }
            });
        }
    }, [userId])

    if (!me || !chatRooms) return null;

    return (
        <div className="h-screen py-20 px-2 xs:px-10 md:px-20 2xl:px-56">
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full rounded-lg"
            >
                {/* Friend List */}
                <ResizablePanel defaultSize={25} className="min-w-[20%] border-2 dark:bg-slate-900 rounded-md">
                    <div className="relative w-full flex flex-row pl-5 pt-4 pb-1 gap-2">
                        <p className="text-xl font-medium leading-non">Messages</p>
                    </div>
                    {chatRooms && <UserList chatRooms={chatRooms} me={me} userId={Number(userId)} />}
                </ResizablePanel>

                {/* Dragable handler for resize*/}
                <ResizableHandle className="p-2 bg-transparent" />

                {/* Chat Container */}
                <ResizablePanel defaultSize={75} className="min-w-[50%] border-2 dark:bg-slate-900 rounded-md">
                    {userId && chattingUser && <ChatRoom user={chattingUser} />}
                    {!userId &&
                        <div className="flex flex-col items-center justify-center h-full text-muted select-none">
                            <Icon name="message-circle-dashed" className="h-52 w-52" />
                            <p className="text-5xl font-bold tracking-wider">Chat</p>
                        </div>
                    }
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* Navigate */}
            <div className="absolute top-0 left-0">
                <Button variant={"ghost"} onClick={handlePreviousPage} className="h-12 rounded-sm">
                    <Icon name="arrow-left" />
                </Button>
            </div>

            {/* Theme */}
            <ThemeToggleButton className="absolute top-1 right-1" />
        </div >
    );
}

type UserListProps = {
    me: User;
    chatRooms?: ChatType[];
    userId: number;
}

const UserList: React.FC<UserListProps> = ({
    me,
    chatRooms,
    userId
}) => {

    const navigate = useNavigate();

    const handleUserClick = (user: User) => {
        navigate(`/chat/${user.id}`);
    }

    if (!chatRooms) return null;

    const isCurrentChat = (chat: ChatType): boolean => {
        return chat.user1.id === userId || chat.user2.id === userId;
    }

    return (
        <ScrollArea className="h-full w-full py-2">
            {chatRooms.map((chat) => (
                <div key={chat.id} className={`flex flex-row items-end gap-1 px-4 py-3 hover:bg-muted cursor-pointer ${isCurrentChat(chat) ? "bg-muted" : ""}`} onClick={() => handleUserClick(chat.user1.id === me.id ? chat.user2 : chat.user1)}>
                    <AvatarContainer avatar_url={chat.user1.id === me.id ? chat.user2.avatar_url : chat.user1.avatar_url} hasStory={true} className="h-fit" />
                    <div className="pl-3 flex flex-col grow">
                        <span className="font-medium">{chat.user1.id === me.id ? chat.user2.username : chat.user1.username}</span>
                        <span className={`text-muted-foreground line-clamp-1 text-sm ${!chat.latestMessage?.content ? "opacity-30" : ""}`}>{chat.latestMessage?.content || "Type something"}</span>
                    </div>
                    <div className={`relative bg-gradient rounded-full h-4 aspect-square text-center text-xs text-white mb-[2px] ${(chat.unread_count === undefined || chat.unread_count <= 0) ? "opacity-0" : ""}`}>
                        {chat.unread_count}
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
}

export default Chat;