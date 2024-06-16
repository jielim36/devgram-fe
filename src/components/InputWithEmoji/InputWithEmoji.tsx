import { Label } from "../ui/label";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Textarea } from "../ui/textarea";
import { ChangeEvent, useRef } from "react";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Icon from "../Icon/Icon";

type InputWithEmojiProps = {
    content: string;
    setContent: (content: string) => void;
    label?: string;
    containerClassName?: string;
    isShowLabel?: boolean;
    placeholder?: string;
    textAreaClassName?: string;
    textAreaRef?: React.RefObject<HTMLTextAreaElement>;
    autoFocus?: boolean;
}

const InputWithEmoji: React.FC<InputWithEmojiProps> = ({
    content,
    setContent,
    label,
    containerClassName = "flex flex-col gap-2",
    isShowLabel = true,
    placeholder,
    textAreaClassName = "max-h-[70vh] overflow-auto",
    textAreaRef = useRef<HTMLTextAreaElement>(null),
    autoFocus = false
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
                <Label htmlFor="inputWithEmoji" className="">{label}</Label>
            }
            <div className="flex flex-row gap-2 items-start mt-1">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Icon name="smile-plus" />
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
                    autoFocus={autoFocus}
                />
            </div>
        </div>
    );
}

export default InputWithEmoji;