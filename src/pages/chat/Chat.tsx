import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User } from "@/types";
import ChatRoom from "./ChatRoom";
import { useState } from "react";
import ThemeToggleButton from "@/components/ThemeToggleButton/ThemeToggleButton";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {

    const [chattingUser, setChattingUser] = useState<User | null>(fakeUsers[0]);
    const { userId } = useParams();

    const handlePreviousPage = () => {
        history.back();
    }

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
                    <UserList setCurrentChattingUser={setChattingUser} />
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

const fakeUsers: User[] = [
    {
        id: 1,
        username: "user1",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
    {
        id: 2,
        username: "user2",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
    {
        id: 3,
        username: "user3",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
    {
        id: 4,
        username: "user4",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
    {
        id: 5,
        username: "user5",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
    {
        id: 6,
        username: "user6",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
    {
        id: 7,
        username: "user7",
        is_active: false,
        created_at: "",
        updated_at: ""
    },
]

type UserListProps = {
    setCurrentChattingUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({
    setCurrentChattingUser
}) => {

    const navigate = useNavigate();

    const handleUserClick = (user: User) => {
        setCurrentChattingUser(user);
        navigate(`/chat/${user.id}`);
    }

    return (
        <ScrollArea className="h-full w-full py-2">
            {fakeUsers.map((user) => (
                <div key={user.id} className="flex flex-row items-end gap-1 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => handleUserClick(user)}>
                    <AvatarContainer avatar_url={user.avatar_url} hasStory={true} className="h-fit" />
                    <div className="pl-3 flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-muted-foreground line-clamp-1">Hey, are you therefgsdfg fgsdfg fdgsdf fgsfg?</span>
                    </div>
                    <div className="relative bg-gradient rounded-full h-4 aspect-square text-center text-xs text-white mb-[2px]">
                        2
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
}

export default Chat;