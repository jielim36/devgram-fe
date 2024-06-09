import { PopoverTrigger } from "@radix-ui/react-popover";
import { Label } from "../ui/label";
import { Popover, PopoverContent } from "../ui/popover";
import { SmilePlusIcon } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Textarea } from "../ui/textarea";
import { ChangeEvent, useRef } from "react";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

type InputWithEmojiProps = {
    content: string;
    setContent: (content: string) => void;
    label?: string;
    containerClassName?: string;
    isShowLabel?: boolean;
    placeholder?: string;
    textAreaClassName?: string;
    textAreaRef?: React.RefObject<HTMLTextAreaElement>;
}

const InputWithEmoji: React.FC<InputWithEmojiProps> = ({
    content,
    setContent,
    label,
    containerClassName = "flex flex-col gap-2",
    isShowLabel = true,
    placeholder,
    textAreaClassName = "max-h-[70vh] overflow-auto",
    textAreaRef = useRef<HTMLTextAreaElement>(null)
}) => {

    const onEmojiClick = (emojiObject: EmojiClickData, _event: MouseEvent) => {
        if (textAreaRef.current) {
            const cursorPosition = textAreaRef.current.selectionStart;
            const textBeforeCursor = content.substring(0, cursorPosition);
            const textAfterCursor = content.substring(cursorPosition);

            setContent(textBeforeCursor + emojiObject.emoji + textAfterCursor);

            // Set the cursor position to be after the inserted emoji
            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.selectionStart = cursorPosition + emojiObject.emoji?.length;
                    textAreaRef.current.selectionEnd = cursorPosition + emojiObject.emoji?.length;
                    textAreaRef.current.focus();
                }
            }, 0);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };


    return (
        <div className={containerClassName}>
            {isShowLabel &&
                <Label htmlFor="inputWithEmoji">{label}</Label>
            }
            <div className="flex flex-row gap-2 items-start">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <SmilePlusIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent >
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </DropdownMenuContent>
                </DropdownMenu>
                <Textarea id="inputWithEmoji"
                    ref={textAreaRef}
                    value={content}
                    placeholder={placeholder ? placeholder : label ? `Type your ${label?.toLowerCase()}` : ""}
                    className={textAreaClassName}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default InputWithEmoji;