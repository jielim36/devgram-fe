
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Message } from "@/types"
import { useState } from "react"

type UpdateMessageContentDialogProps = {
    onUpdateMessageContent: (message: Message) => void;
    message: Message;
    trigger: React.ReactNode;
}

const UpdateMessageContentDialog: React.FC<UpdateMessageContentDialogProps> = ({
    onUpdateMessageContent,
    message,
    trigger,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messageContent, setMessageContent] = useState(message.content);

    const handleCloseDialog = () => {
        setIsOpen(false);
    }

    const handleUpdateMessageContent = () => {
        onUpdateMessageContent({
            ...message,
            content: messageContent
        });
        handleCloseDialog();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                    {/* <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this file from our servers?
                    </DialogDescription> */}
                </DialogHeader>
                <Input
                    type="text"
                    placeholder="Type your message here"
                    value={messageContent}
                    onChange={(event) => setMessageContent(event.target.value)}
                />
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdateMessageContent}>Save</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateMessageContentDialog;