import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Message } from "@/types";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type ReactMessageSelectionBarProps = {
    trigger: React.ReactNode;
    message: Message;
    onAddReaction: (reaction: string, messageId: number) => void;
}

const ReactMessageSelectionBar: React.FC<ReactMessageSelectionBarProps> = ({
    trigger,
    message,
    onAddReaction
}) => {

    const reactions = {
        like: '👍',
        laugh: '😄',
        love: '❤️',
        wow: '😮',
        sad: '😢',
        angry: '😡'
    };

    const handleAddReaction = (reaction: keyof typeof reactions) => {
        if (!message?.id) return;

        if (message?.reaction === (reactions[reaction as keyof typeof reactions])) {
            // cancel reaction
            onAddReaction('', message?.id);
        } else {
            onAddReaction(reactions[reaction], message?.id);
        }
    }

    return (
        <Popover>
            <PopoverTrigger>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-fit rounded-full overflow-hidden flex flex-row gap-1 p-1">
                {Object.keys(reactions).map((reaction) => (
                    <div key={reaction}>
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            className={`rounded-full ${message?.reaction === (reactions[reaction as keyof typeof reactions]) ? 'bg-muted' : ''}`}
                            onClick={() => handleAddReaction(reaction as keyof typeof reactions)}
                        >
                            {reactions[reaction as keyof typeof reactions]}
                        </Button>
                    </div>
                ))}

                {/* Custom */}
                {message?.id &&
                    <div>
                        <AddCustomReaction onAddReaction={onAddReaction} messageId={message?.id} />
                    </div>
                }
            </PopoverContent>
        </Popover>
    );
}

type AddCustomReactionProps = {
    messageId: number;
    onAddReaction: (reaction: string, messageId: number) => void;
}

const AddCustomReaction: React.FC<AddCustomReactionProps> = ({
    messageId,
    onAddReaction
}) => {

    const onEmojiClick = (emojiObject: EmojiClickData, _event: MouseEvent) => {
        onAddReaction(emojiObject.emoji, messageId);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size={"icon"}
                    variant={"secondary"}
                    className="rounded-full"
                >
                    <Icon name="plus" className="text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <EmojiPicker onEmojiClick={onEmojiClick} />
            </PopoverContent>
        </Popover>
    );
}

export default ReactMessageSelectionBar