import { Post } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "../ui/separator";
import Icon from "../Icon/Icon";
import { useDeletePost } from "@/hooks";

type PostMenuSelectionProps = {
    userId?: number;
    post: Post;
    triggerClassName?: string;
    containerClassName?: string;
}

const PostMenuSelection: React.FC<PostMenuSelectionProps> = ({ userId, post, triggerClassName, containerClassName }) => {

    const deletePostMutation = useDeletePost({
        onSuccess: () => {
            //TODO: Add toast notification
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const handleDeletePost = () => {
        deletePostMutation.mutate(post.id);
    }

    return (
        <Dialog >
            <DialogTrigger className={triggerClassName} >
                <Icon name="ellipsis" />
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
                        {userId === post.user.id && (
                            <>
                                <Separator />
                                <li>Edit Post</li>
                                <Separator />
                                <li className="text-red-500" onClick={handleDeletePost}>Delete Post</li>
                            </>

                        )}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PostMenuSelection;