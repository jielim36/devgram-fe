import { Post } from "@/types";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import InputWithEmoji from "../InputWithEmoji/InputWithEmoji";
import { useUpdatePostDescription } from "@/hooks";
import { queryClient } from "@/app/App";
import { POST_QUERY_KEY } from "@/constants";
import toast from "react-hot-toast";

const EditDescriptionDialog = ({ post }: { post: Post }) => {

    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState(post.description);
    const updatePostDescriptionMutation = useUpdatePostDescription({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
            setOpen(false);
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const handleEditDescription = () => {
        // Edit description logic here
        toast.promise(updatePostDescriptionMutation.mutateAsync({ postId: post.id, description }), {
            loading: "Updating description",
            success: "Description updated",
            error: "Error updating description"
        });
    }

    return (
        <Dialog open={open}>
            <DialogTrigger onClick={() => setOpen(true)}>Edit</DialogTrigger>
            <DialogContent disableCloseBtn className="min-w-[300px] w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Description</DialogTitle>
                    <DialogDescription className="">
                        <InputWithEmoji
                            content={description}
                            setContent={setDescription}
                            label="Description"
                            containerClassName=""
                        />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={"secondary"} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditDescription}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

};

export default EditDescriptionDialog;