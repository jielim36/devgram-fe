import { Post, User } from "@/types";
import { Card } from "../ui/card";
import AvatarContainer from "../AvatarContainer/AvatarContainer";
import { Button } from "../ui/button";
import { BookmarkIcon, EllipsisIcon, HeartIcon, MenuIcon, MessageCircleIcon, SendIcon, UserRoundIcon } from "lucide-react";
import { Input } from "../ui/input";
import FloatPostItem from "./FloatPostItem";
import PostSwiper from "../Swiper/PostSwiper";
import PostMenuSelection from "./PostMenuSelection";
import convertDate from "@/utils/convertDateFormat";
import LikeMessageGenerate from "./LikeMessageGenerate";
import { useLikePost, useUnlikePost } from "@/hooks";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

type PostItemProps = {
    post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {

    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const addLikeMutation = useLikePost({
        onSuccess: () => {
            setIsLiked(true);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const removeLikeMutation = useUnlikePost({
        onSuccess: () => {
            setIsLiked(false);
        },
        onError: (error) => {
            console.log(error);
        }
    });


    useEffect(() => {
        if (post?.likes && post.likes.length > 0) {
            setIsLiked(post.likes.some(like => like.user.id === user?.id));
        }
    }, [])

    const handleLikePost = () => {
        if (addLikeMutation.isPending || removeLikeMutation.isPending) return;

        if (!isLiked) {
            addLikeMutation.mutate(post.id);
        } else {
            removeLikeMutation.mutate(post.id);
        }
    }

    return (
        <Card className="flex flex-col">
            <div className="flex flex-row gap-2 py-1 px-2 justify-center items-center">
                <AvatarContainer avatar_url={post.user.avatar_url} hasStory={post.user.stories != undefined && post.user.stories?.length > 0} className="flex-none" />
                <div className="flex-auto flex flex-row items-center gap-3">
                    <p className="text-sm">{post.user.username}</p>
                    <div className="flex flex-row items-center gap-1 text-sm">
                        <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                        <p className="text-muted-foreground">{convertDate(post.created_at)}</p>
                    </div>
                </div>
                <PostMenuSelection post={post} triggerClassName="px-2" />
            </div>

            <PostSwiper postImages={post.images_url} />

            {/* Interaction List */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button
                        variant={"link"}
                        size="icon"
                        onClick={handleLikePost}>
                        <HeartIcon fill={isLiked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "transparent"} className={isLiked ? "text-red-500" : ""} />
                    </Button>
                    <FloatPostItem postId={post.id} trigger={<MessageCircleIcon />} />
                    <Button variant={"link"} size="icon">
                        <SendIcon />
                    </Button>
                </div>
                <Button variant={"link"} size="icon">
                    <BookmarkIcon />
                </Button>
            </div>

            {/* Information */}
            <div className="px-3 pb-3 flex flex-col">
                {post?.likes && post.likes.length > 0 && <LikeMessageGenerate likes={post.likes} />}
                <span className="line-clamp-2"><span className="font-bold">{post.user.username}</span> {post.description}</span>
                <FloatPostItem postId={post.id} triggerClassName="w-fit mt-1" trigger={
                    <span className="text-muted-foreground cursor-pointer text-sm hover:underline" onClick={() => { }}>View all {post?.comments.length > 0 ? post.comments.length : ""} comments</span>
                } />
                <div className="flex flex-col">
                    {post?.comments && post.comments.length > 0 && post.comments.slice(0, 2).map((comment, index) => (
                        <div key={index} className="flex flex-row gap-1">
                            <p className="font-bold">{comment.user.username}</p>
                            <p className="line-clamp-1">{comment.content}</p>
                        </div>
                    ))}
                </div>
                <div className="flex w-full items-center space-x-2 pt-4">
                    <FloatPostItem postId={post.id} trigger={<Input type="text" placeholder="Add comment" className="w-full" />} triggerClassName="w-full" />
                </div>
            </div>

        </Card >
    );
}

export default PostItem;