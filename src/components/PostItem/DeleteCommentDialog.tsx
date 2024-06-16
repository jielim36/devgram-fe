import { queryClient } from "@/app/App";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { POST_QUERY_KEY } from "@/constants";
import { useDeleteComment } from "@/hooks";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useState } from "react";

const DeleteCommentDialog = ({ commentId }: { commentId: number }) => {

    const [open, setOpen] = useState(false);

    const deleteCommentMuatation = useDeleteComment({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
            setOpen(false);
        }
    });


    const handleDeleteComment = () => {
        toast.promise(deleteCommentMuatation.mutateAsync(commentId),
            {
                loading: "Deleting comment",
                success: "Comment deleted",
                error: "Error deleting comment"
            }
        );
    }

    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)}>Delete</DialogTrigger>
            <DialogContent disableCloseBtn>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure to delete this comment?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your comment and remove it from the post.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={"secondary"} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant={"destructive"} onClick={handleDeleteComment}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteCommentDialog;