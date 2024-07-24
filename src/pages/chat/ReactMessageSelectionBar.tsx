import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type ReactMessageSelectionBarProps = {
    trigger: React.ReactNode;
    onAddReaction: (reaction: string, messageId: number) => void;
}

const ReactMessageSelectionBar: React.FC<ReactMessageSelectionBarProps> = ({
    trigger,
    onAddReaction
}) => {

    return (
        <Popover>
            <PopoverTrigger>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="rounded-full overflow-hidden flex flex-row gap-3 p-1">
                {/* LIKE */}
                <div>
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="rounded-full"
                        onClick={() => onAddReaction('👍', 1)}
                    >
                        👍
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );

}

export default ReactMessageSelectionBar