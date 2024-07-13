import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import InputWithEmoji from "@/components/InputWithEmoji/InputWithEmoji";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Message, User } from "@/types";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type ChatRoomProps = {
    user: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
    user
}) => {

    const { userId } = useParams();
    const { user: me } = useAuth();
    const [message, setMessage] = useState<string>("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollParentAreaRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

    useEffect(() => {
        if (scrollAreaRef.current) {
            // Auto scroll to bottom
            scrollAreaRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollAreaRef]);

    useEffect(() => {
        // console.log(userId);
    }, [userId]);

    useEffect(() => {
        // console.log(userId);
        console.log(isAtBottom);

    }, [isAtBottom]);

    if (!userId || !me) return null;

    return (
        <div className="h-full w-full flex flex-col">

            {/* User Info */}
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

            {/* Chat Messages */}
            <ScrollArea>
                <div
                    ref={scrollAreaRef}
                    className="h-full flex flex-col gap-4 p-4 justify-end"
                >
                    {fakeMessages.map((message) => (
                        <div key={message.id} className={`group w-full`}>
                            <div className={`max-w-[70%] w-fit flex gap-1 items-center ${message.sender_id === me.id ? "flex-row-reverse" : "flex-row"} ${message.sender_id === me.id ? "float-right" : ""}`}>
                                <AvatarContainer avatar_url={message.sender_id === me.id ? me.avatar_url : user.avatar_url} hasStory={false} />
                                <div className="px-3 py-2 border w-fit rounded-md font-normal">
                                    {message.content}
                                </div>
                                <Popover>
                                    <PopoverTrigger>
                                        <div className={`opacity-0 group-hover:opacity-100 cursor-pointer px-2`}>
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

            {
                isAtBottom ? null : (
                    <div>GO Back</div>
                )
            }

            < Separator />
            {/* Input message */}
            < div className="pl-4 pr-2 py-2 flex flex-row items-center gap-1" >
                <div className="grow">
                    <InputWithEmoji
                        content={message}
                        setContent={setMessage}
                        containerClassName="m-0"
                        textAreaClassName="resize-none min-h-4 max-h-12"
                    />
                </div>
                <Button className="" variant={"ghost"}>
                    <Icon name="send-horizontal" className="" />
                </Button>
            </div >
        </div >
    )
}

const fakeMessages: Message[] = [
    {
        id: 1,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Hey, how are you?",
        is_read: true,
        created_at: "2023-07-12T14:48:00.000Z",
        updated_at: "2023-07-12T14:48:00.000Z"
    },
    {
        id: 2,
        chat_id: 1,
        sender_id: 1002,
        receiver_id: 1001,
        content: "I'm good, thanks! How about you?",
        is_read: true,
        created_at: "2023-07-12T14:49:00.000Z",
        updated_at: "2023-07-12T14:49:00.000Z"
    },
    {
        id: 3,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Doing well! What are you up to?",
        is_read: false,
        created_at: "2023-07-12T14:50:00.000Z",
        updated_at: "2023-07-12T14:50:00.000Z"
    },
    {
        id: 4,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Just working on a project. You?",
        is_read: false,
        created_at: "2023-07-12T14:51:00.000Z",
        updated_at: "2023-07-12T14:51:00.000Z"
    },
    {
        id: 5,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Did you see the latest news?",
        refer_msg_id: 4,
        reaction: "👍",
        is_read: true,
        created_at: "2023-07-12T15:00:00.000Z",
        updated_at: "2023-07-12T15:00:00.000Z"
    },
    {
        id: 6,
        chat_id: 1,
        sender_id: 1002,
        receiver_id: 1001,
        content: "Yes, it's quite interesting.",
        is_read: true,
        created_at: "2023-07-12T15:01:00.000Z",
        updated_at: "2023-07-12T15:01:00.000Z"
    },
    {
        id: 7,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "We should discuss it later.",
        is_read: false,
        created_at: "2023-07-12T15:02:00.000Z",
        updated_at: "2023-07-12T15:02:00.000Z"
    },
    {
        id: 8,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Are you coming to the meeting?",
        is_read: true,
        created_at: "2023-07-12T15:10:00.000Z",
        updated_at: "2023-07-12T15:10:00.000Z"
    },
    {
        id: 9,
        chat_id: 1,
        sender_id: 1002,
        receiver_id: 1001,
        content: "Yes, I'll be there in 10 minutes.",
        is_read: false,
        created_at: "2023-07-12T15:11:00.000Z",
        updated_at: "2023-07-12T15:11:00.000Z"
    },
    {
        id: 10,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Great, see you soon!",
        is_read: false,
        created_at: "2023-07-12T15:12:00.000Z",
        updated_at: "2023-07-12T15:12:00.000Z"
    },
    {
        id: 11,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Great, see you soon!",
        is_read: false,
        created_at: "2023-07-12T15:12:00.000Z",
        updated_at: "2023-07-12T15:12:00.000Z"
    },
    {
        id: 12,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Great, see you soon!",
        is_read: false,
        created_at: "2023-07-12T15:12:00.000Z",
        updated_at: "2023-07-12T15:12:00.000Z"
    },
    {
        id: 13,
        chat_id: 1,
        sender_id: 1001,
        receiver_id: 1002,
        content: "Great, see you soon!",
        is_read: false,
        created_at: "2023-07-12T15:12:00.000Z",
        updated_at: "2023-07-12T15:12:00.000Z"
    }
];


export default ChatRoom;