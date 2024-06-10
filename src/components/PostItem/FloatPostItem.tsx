import { Comment, Post, User } from "@/types";
import AvatarContainer from "../AvatarContainer/AvatarContainer";
import { Button } from "../ui/button";
import { BookmarkIcon, EllipsisIcon, HeartIcon, MessageCircleIcon, SendHorizonalIcon, SendIcon, SmilePlusIcon, UserRoundIcon } from "lucide-react";
import { Input } from "../ui/input";
import PostSwiper from "../Swiper/PostSwiper";
import "@/style/color.css"
import { Separator } from "../ui/separator";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import PostMenuSelection from "./PostMenuSelection";
import convertDate, { convertDateWithShort } from "@/utils/convertDateFormat";
import { useEffect, useRef, useState } from "react";
import LikeMessageGenerate from "./LikeMessageGenerate";
import InputWithEmoji from "../InputWithEmoji/InputWithEmoji";
import { useAddComment } from "@/hooks";

type FloatPostProps = {
    post: Post;
}

type FloatPostItemProps = {
    trigger: React.ReactNode;
    triggerClassName?: string;
}

const FloatPostItem: React.FC<FloatPostProps & FloatPostItemProps> = ({ post, trigger, triggerClassName }) => {
    return (
        <Dialog>
            <DialogTrigger className={triggerClassName}>
                {trigger}
            </DialogTrigger>
            <DialogContent className="p-2 w-[90vw] lg:w-[85vw] max-h-[95vh]" disableCloseBtn>
                <FloatPost post={post} />
            </DialogContent>
        </Dialog>
    );
}

const FloatPost: React.FC<FloatPostProps> = ({ post }) => {

    const [commentContent, setCommentContent] = useState<string>("");
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const addCommentMutation = useAddComment({
        onSuccess: () => {
            setCommentContent("");
            //TODO: remind user
        }
    });

    const focusCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }

    const handleAddComment = () => {
        if (commentContent.trim() === "") return;
        //TODO: remind user

        addCommentMutation.mutate({
            postId: post.id,
            parentId: 0,
            content: commentContent
        });
    }

    const generateChildComments = (comment: Comment, index: number) => {
        return (
            post.comments.map((comment, index) => (
                <div key={index} className="flex flex-row">
                    <div>
                        <AvatarContainer
                            avatar_url={comment.user.avatar_url}
                            hasStory={comment.user.stories != undefined && comment.user.stories?.length > 0}
                        />
                    </div>
                    <div className="grow flex flex-col gap-1">
                        <div className="flex flex-row">
                            <div className="grow flex-col px-2">
                                {/* Comment Information: username and date*/}
                                <div className="flex flex-row gap-1 items-center">
                                    <p className="font-bold">{comment.user.username}</p>
                                    <div className="rounded-full w-[5px] h-[5px] bg-slate-300 translate-y-[1px]"></div>
                                    <p className="text-xs">{convertDateWithShort(comment.created_at)}</p>
                                </div>

                                {/* comment content */}
                                <p className="">{comment.content}</p>
                                <div className="text-xs text-muted-foreground cursor-pointer flex flex-row gap-4">
                                    <p className="hover:underline">Reply</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <HeartIcon width={18} />
                                <p className="text-xs">{comment.likes || ""}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-[95vh] xl:h-[85vh] lg:h-[70vh] gap-2 overflow-auto lg:overflow-hidden" >
            <div className={`grow h-full w-full max-h-[90vw] xl:max-h-[85vh] lg:max-h-[70vh] rounded-md lg:h-[70vh]`}>
                <PostSwiper postImages={post.images_url} className={`h-[90vw] xl:h-[85vh] lg:h-[70vh] lg:w-[70vh] xl:w-[85vh] max-h-[50vh] xl:max-h-[85vh] lg:max-h-[70vh] w-full overflow-hidden rounded-md`} swiperClassName="" />
            </div>

            {/* Information */}
            <div className="pt-2 xl:pt-0 px-0 pb-3 flex flex-col justify-between h-full lg:overflow-auto w-full">
                <div className="flex flex-row justify-between items-center px-2">
                    <div className="flex flex-row items-center gap-2">
                        <AvatarContainer avatar_url={post?.user.avatar_url} hasStory={post?.user.stories != undefined && post?.user.stories?.length > 0} className="flex-none" />
                        <p className="font-bold">{post?.user.username}</p>
                    </div>
                    <PostMenuSelection post={post} />
                </div>
                <Separator className="my-2" />
                <div className="h-full flex flex-col overflow-y-scroll px-2">
                    {/* Comments Area */}
                    <div className="grow flex flex-col gap-2 text-sm">
                        <div className="flex flex-row">
                            <div>
                                <AvatarContainer
                                    avatar_url={post.user.avatar_url}
                                    hasStory={post.user.stories != undefined && post.user.stories?.length > 0}
                                />
                            </div>
                            <div className="grow flex-col px-2">
                                {/* Comment Information: username and date*/}
                                <div className="flex flex-row gap-1 items-center">
                                    <p className="font-bold">{post.user.username}</p>
                                    <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                    <p className="text-xs">{convertDateWithShort(post.created_at)}</p>
                                </div>

                                {/* comment content */}
                                <p className="">{post?.description}</p>
                            </div>
                        </div>
                        {post?.comments && post?.comments?.map((comment, index) => (
                            <div key={index} className="flex flex-row">
                                <div>
                                    <AvatarContainer
                                        avatar_url={comment.user.avatar_url}
                                        hasStory={comment.user.stories != undefined && comment.user.stories?.length > 0}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    {/* Parent comment */}
                                    <div className="flex flex-row">
                                        <div className="grow flex-col px-2">
                                            {/* Comment Information: username and date*/}
                                            <div className="flex flex-row gap-1 items-center">
                                                <p className="font-bold">{comment.user.username}</p>
                                                <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                                <p className="text-xs">{convertDateWithShort(comment.created_at)}</p>
                                            </div>

                                            {/* comment content */}
                                            <p className="">{comment.content}</p>
                                            <div className="text-xs text-muted-foreground cursor-pointer flex flex-row gap-4">
                                                <p className="hover:underline">Reply</p>
                                                <p className="hover:underline">View comments</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <HeartIcon width={18} />
                                            <p className="text-xs">{comment.likes || ""}</p>
                                        </div>
                                    </div>

                                    {/* Child comments */}
                                    {generateChildComments(comment, index)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="my-1" />

                <div className="">
                    {/* Interaction List */}
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-2">
                            <Button variant={"link"} size="icon">
                                <HeartIcon />
                            </Button>
                            <Button variant={"link"} size="icon" onClick={focusCommentInput}>
                                <MessageCircleIcon />
                            </Button>
                            <Button variant={"link"} size="icon">
                                <SendIcon />
                            </Button>
                        </div>
                        <Button variant={"link"} size="icon">
                            <BookmarkIcon />
                        </Button>
                    </div>

                    {post.likes && post.likes.length > 0 && <LikeMessageGenerate likes={post.likes} />}
                    <div className="flex flex-row items-center gap-1 text-sm px-2">
                        <p className="text-muted-foreground">{convertDate(post.created_at)}</p>
                    </div>
                    <div className="flex w-full space-x-2 pt-4">
                        {/* <SmilePlusIcon className="mx-1" />
                        <Input type="text" placeholder="Add comment" autoFocus className="flex-1" /> */}
                        <InputWithEmoji
                            textAreaRef={commentInputRef}
                            content={commentContent}
                            setContent={setCommentContent}
                            placeholder="Add a comment..."
                            containerClassName="flex-1"
                            textAreaClassName="resize-none h-4"
                            isShowLabel={false}
                        />
                        <Button variant="default" size="icon" className="" onClick={handleAddComment}>
                            <SendHorizonalIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FloatPostItem;