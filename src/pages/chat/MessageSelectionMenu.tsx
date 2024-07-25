import { Message } from "@/types";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Icon from "@/components/Icon/Icon";
import { Separator } from "@/components/ui/separator";
import ReactMessageSelectionBar from "./ReactMessageSelectionBar";
import DeleteMessageDialog from "./DeleteMessageDialog";
import { useEffect, useState } from "react";
import UpdateMessageContentDialog from "./UpdateMessageContentDialog";

type MessageSelectionMenuProps = {
    isMe: boolean;
    message: Message;
    onDelete: (message: Message) => void;
    onAddReaction: (reaction: string, messageId: number) => void;
    onUpdateMessageContent: (message: Message) => void;
    setReplyMessageId: (messageId: number) => void;
    setIsOpenMessageSelectionMenu: (index: number) => void;
    index: number
}

const MessageSelectionMenu: React.FC<MessageSelectionMenuProps> = ({
    isMe,
    message,
    onDelete,
    onAddReaction,
    onUpdateMessageContent,
    setReplyMessageId,
    setIsOpenMessageSelectionMenu,
    index
}) => {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        setIsOpenMessageSelectionMenu(isOpen ? index : -1);
    }, [isOpen]);

    const handleReply = () => {
        if (!message.id) return;
        setReplyMessageId(message.id);
        setIsOpen(false);
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
                <div className={`opacity-0 group-hover:opacity-100 cursor-pointer px-2 m-auto`}>
                    <Icon name="ellipsis" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col min-w-0 w-fit p-0">
                <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted" onClick={handleReply}>
                    <Icon name="reply" />
                    <p>Reply</p>
                </div>
                {!isMe && (
                    <>
                        <Separator />
                        <ReactMessageSelectionBar
                            trigger={
                                <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                    <Icon name="laugh" />
                                    <p>React</p>
                                </div>
                            }
                            onAddReaction={onAddReaction}
                            message={message}
                        />
                    </>
                )}
                {isMe && (
                    <>
                        <Separator />
                        <UpdateMessageContentDialog
                            trigger={
                                <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                    <Icon name="pencil" />
                                    <p>Edit</p>
                                </div>
                            }
                            message={message}
                            onUpdateMessageContent={onUpdateMessageContent}
                        />
                    </>
                )}
                {isMe && (
                    <>
                        <Separator />
                        <DeleteMessageDialog trigger={
                            <div className="flex flex-row gap-3 p-3 cursor-pointer hover:bg-muted">
                                <Icon name="trash-2" />
                                <p>Delete</p>
                            </div>
                        } onDelete={() => onDelete(message)} />
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}

export default MessageSelectionMenu