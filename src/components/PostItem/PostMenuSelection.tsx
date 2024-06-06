import { Post } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EllipsisIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useState } from "react";

type PostMenuSelectionProps = {
    post: Post;
    triggerClassName?: string;
    containerClassName?: string;
}

const PostMenuSelection: React.FC<PostMenuSelectionProps> = ({ post, triggerClassName, containerClassName }) => {

    return (
        <Dialog >
            <DialogTrigger className={triggerClassName} >
                <EllipsisIcon />
            </DialogTrigger>
            <DialogContent className={`w-9/12 sm:w-[300px] ${containerClassName}`}>
                <div className="w-full">
                    <ul className="flex flex-col gap-4 text-center cursor-pointer select-none">
                        <li>Follow / Unfollow</li>
                        <Separator />
                        <li>Share to</li>
                        <Separator />
                        <li>Copy Link</li>
                        <Separator />
                        <li>Account Description</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PostMenuSelection;