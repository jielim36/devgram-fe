
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
import { useState } from "react"

type DeleteMessageDialogProps = {
    onDelete: () => void;
    trigger: React.ReactNode;
}

const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({
    onDelete,
    trigger,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseDialog = () => {
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely delete this message?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this file from our servers?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" variant={"destructive"} onClick={() => {
                        onDelete();
                        handleCloseDialog();
                    }}>Confirm</Button>
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

export default DeleteMessageDialog;