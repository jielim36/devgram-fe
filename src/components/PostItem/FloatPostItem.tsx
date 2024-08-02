import { Comment, Post, User } from "@/types";
import AvatarContainer from "../AvatarContainer/AvatarContainer";
import { Button } from "../ui/button";
import { ChevronDownIcon, ChevronUpIcon, HeartIcon } from "lucide-react";
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
import { useAddComment, useLikePost, useGetPostByPostId, useUnlikePost, useLikeComment, useUnlikeComment, useDeleteComment } from "@/hooks";
import { useAuth } from "@/utils/AuthProvider";
import Icon from "../Icon/Icon";
import toast from "react-hot-toast";
import { queryClient } from "@/app/App";
import { POST_QUERY_KEY } from "@/constants";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { renderBioWithLinksAndBreaks } from "@/utils/ContentFormatter";

type FloatPostProps = {
    // post: Post;
    postId: number;
}

type FloatPostItemProps = {
    trigger: React.ReactNode;
    triggerClassName?: string;
}

const replyingStyle = "bg-slate-300 border border-slate-300 rounded-md p-2";

const FloatPostItem: React.FC<FloatPostProps & FloatPostItemProps> = ({ postId, trigger, triggerClassName }) => {
    return (
        <Dialog>
            <DialogTrigger className={triggerClassName}>
                {trigger}
            </DialogTrigger>
            <DialogContent className="p-2 w-fit lg:w-[85vw] max-h-[95vh]" disableCloseBtn>
                <FloatPost postId={postId} />
            </DialogContent>
        </Dialog>
    );
}

const FloatPost: React.FC<FloatPostProps> = ({ postId }) => {

    const isLargeScreen = useMediaQuery({ minWidth: 1024 });
    const isWidthGreaterThanHeight = useMediaQuery({ query: '(min-aspect-ratio: 1/1)' });
    const [isOpenDrawerComment, setIsOpenDrawerComment] = useState(false);
    const [post, setPost] = useState<Post>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [currentLikeCommentId, setCurrentLikeCommentId] = useState<number | null>(null);
    const [currentReplyCommentId, setCurrentReplyCommentId] = useState<number>(0);
    const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
    const { user } = useAuth();
    const [commentContent, setCommentContent] = useState<string>("");
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const { data: postData } = useGetPostByPostId(postId);
    const addCommentMutation = useAddComment({
        onSuccess: () => {
            setCommentContent("");
            setCurrentReplyCommentId(0);
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
        }
    });
    const likePostMutation = useLikePost({
        onSuccess: () => {
            setIsLiked(true);
        },
        onError: (error) => {
            console.log(error);
        }
    })
    const unlikePostMutation = useUnlikePost({
        onSuccess: () => {
            setIsLiked(false);
        },
        onError: (error) => {
            console.log(error);
        }
    });
    const likeCommentMutation = useLikeComment({
        onSuccess: (data) => {
            if (data.data && currentLikeCommentId) {
                setPost((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            comments: prev.comments.map(comment => {
                                if (comment.id === currentLikeCommentId) {
                                    return {
                                        ...comment,
                                        is_liked: true,
                                    }
                                }
                                return comment;
                            })
                        }
                    }
                    return prev;
                });
            }
            setCurrentLikeCommentId(null);
        },
        onError: (error) => {
            console.log(error);
            setCurrentLikeCommentId(null);
        }
    });

    const unlikeCommentMutation = useUnlikeComment({
        onSuccess: (data) => {
            if (data.data && currentLikeCommentId) {
                setPost((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            comments: prev.comments.map(comment => {
                                if (comment.id === currentLikeCommentId) {
                                    return {
                                        ...comment,
                                        is_liked: false,
                                    }
                                }
                                return comment;
                            })
                        }
                    }
                    return prev;
                });
            }

            setCurrentLikeCommentId(null);
        },
        onError: (error) => {
            console.log(error);
            setCurrentLikeCommentId(null);
        }
    });

    useEffect(() => {
        if (postData) {
            setPost(postData.data);
            if (postData.data.likes && postData.data.likes.length > 0) {
                setIsLiked(postData.data.likes.some(like => like.user.id === user?.id));
            }
        }
    }, [postData]);

    const handleMessageBtn = () => {
        focusCommentInput();
        setCurrentReplyCommentId(0);
    }

    const handleReplyBtn = (commentId: number, receiverName: string) => {
        focusCommentInput();
        setCurrentReplyCommentId(commentId);
        setCommentContent(`@${receiverName} `);
    }

    const toggleViewComments = (commentId: number) => {
        setExpandedComments(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const focusCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }

    const handleAddComment = () => {
        if (commentContent.trim() === "" || !post) return;
        toast.promise(addCommentMutation.mutateAsync({
            postId: post.id,
            parentId: currentReplyCommentId,
            content: commentContent
        }),
            {
                loading: "Adding comment",
                success: "Comment added",
                error: "Error adding comment"
            }
        );
    }

    useEffect(() => {
        if (post?.likes && post.likes.length > 0) {
            setIsLiked(post.likes.some(like => like.user.id === user?.id));
        }
    }, [isLiked])

    const handleLikePost = () => {
        if (likePostMutation.isPending || unlikePostMutation.isPending || !post) return;

        if (!isLiked) {
            likePostMutation.mutate(post.id);
        } else {
            unlikePostMutation.mutate(post.id);
        }
    }

    const handleLikeComment = (commentId: number) => {
        if (likeCommentMutation.isPending) return;
        if (!post) return;

        setCurrentLikeCommentId(commentId);

        if (post.comments.find(comment => comment.id === commentId)?.is_liked) {
            unlikeCommentMutation.mutate(commentId);

        } else {
            likeCommentMutation.mutate(commentId);
        }

    }

    if (!post) {
        return (
            <div className="h-[50vh] lg:[70vh] xl:h-[85vh] flex justify-center items-center">
                <Icon name="loader-circle" className="animate-spin w-8 h-8 text-muted-foreground" />
            </div>
        )
    }

    if (isLargeScreen) {

        return (
            <div className="flex flex-col lg:flex-row h-[95vh] xl:h-[85vh] lg:h-[70vh] gap-2 overflow-auto lg:overflow-hidden" >
                {post?.images_url && post?.images_url?.length > 0 &&
                    <div className={`grow h-full w-full max-h-[90vw] xl:max-h-[85vh] lg:max-h-[70vh] rounded-md lg:h-[70vh]`}>
                        <PostSwiper postImages={post?.images_url} className={`h-[90vh] xl:h-[85vh] lg:h-[70vh] lg:w-[70vh] xl:w-[85vh] max-h-[50vh] xl:max-h-[85vh] lg:max-h-[70vh] w-full overflow-hidden rounded-md`} swiperClassName="" />
                    </div>
                }

                {/* Information */}
                <div className="pt-2 xl:pt-0 px-0 pb-3 flex flex-col justify-between h-full lg:overflow-auto w-full">
                    <div className="flex flex-row justify-between items-center px-2">
                        <div className="flex flex-row items-center gap-2">
                            <AvatarContainer
                                userId={post?.user?.id}
                                avatar_url={post?.user?.avatar_url}
                                hasStory={post?.user?.stories != undefined && post?.user?.stories?.length > 0}
                                className="flex-none"
                            />
                            <p className="font-bold">{post?.user?.username}</p>
                        </div>
                        {post.user.id === user?.id && <PostMenuSelection post={post} userId={user?.id} />}
                    </div>
                    <Separator className="my-2" />
                    <div className="h-full flex flex-col overflow-y-scroll px-2">
                        {/* Comments Area */}
                        <div className="grow flex flex-col gap-2 text-sm">

                            {/* Post Description as First Comment */}
                            <div className="flex flex-row w-full">
                                <div>
                                    <AvatarContainer
                                        userId={post?.user?.id}
                                        avatar_url={post?.user?.avatar_url}
                                        hasStory={post?.user?.stories != undefined && post?.user.stories?.length > 0}
                                    />
                                </div>
                                <div className="flex-col px-2 w-full">
                                    {/* Comment Information: username and date*/}
                                    <div className="flex flex-row gap-1 items-center">
                                        <p className="font-bold">{post?.user?.username}</p>
                                        <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                        <p className="text-xs">{convertDateWithShort(post?.created_at)}</p>
                                    </div>

                                    {/* comment content */}
                                    {/* <p className="">{post?.description}</p> */}
                                    <div className="max-h-full w-full break-all" dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(post?.description)} />
                                </div>
                            </div>
                            {post?.comments && post?.comments?.length > 0 && buildCommentTree(post?.comments).map((comment, index) => (
                                // Comment Row
                                <div key={index} className={`flex flex-row w-full ${currentReplyCommentId === comment?.id ? replyingStyle : ""}`}>
                                    <div>
                                        <AvatarContainer
                                            userId={comment?.user?.id}
                                            avatar_url={comment?.user?.avatar_url}
                                            hasStory={comment?.user?.stories != undefined && comment?.user?.stories?.length > 0}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        {/* Parent comment */}
                                        <div className="flex flex-row break-all">
                                            <div className="flex-col px-2 w-full">
                                                {/* Comment Information: username and date*/}
                                                <div className="flex flex-row gap-1 items-center">
                                                    <p className="font-bold">{comment?.user?.username}</p>
                                                    <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                                    <p className="text-xs">{convertDateWithShort(comment?.created_at)}</p>
                                                </div>

                                                {/* comment content */}
                                                {/* <p className="max-w-full">{comment?.content}</p> */}
                                                <div className="max-h-full" dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(comment?.content)} />
                                                <div className="text-xs text-muted-foreground cursor-pointer flex flex-wrap gap-x-4">
                                                    <p className="hover:underline" onClick={() => handleReplyBtn(comment?.id, comment?.user?.username)}>Reply</p>
                                                    {comment.children && comment.children.length > 0 && (
                                                        <p className="hover:underline" onClick={() => toggleViewComments(comment.id)}>
                                                            {expandedComments[comment.id] ? 'Hide comments' : 'View comments'}
                                                        </p>
                                                    )}
                                                    {(comment?.user?.id === user?.id || post.user.id === user?.id) &&
                                                        // <p className="hover:underline" onClick={() => handleDeleteComment(comment.id)}>Delete</p>
                                                        <DeleteCommentDialog commentId={comment.id} />
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <HeartIcon
                                                    fill={comment.is_liked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "transparent"}
                                                    className={`cursor-pointer ${comment.is_liked ? "text-red-500" : ""}`}
                                                    onClick={() => handleLikeComment(comment.id)}
                                                />
                                                <p className="text-xs">{comment?.likes && comment?.likes > 0 ? comment?.likes : ""}</p>
                                            </div>
                                        </div>

                                        {/* Child comments */}
                                        {expandedComments[comment.id] && comment.children &&
                                            generateChildComments({
                                                comments: comment?.children,
                                                user: user!,
                                                index: index,
                                                handleReplyBtn,
                                                handleLikeComment,
                                                expandedComments,
                                                toggleViewComments,
                                                post
                                            })
                                        }
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
                                <Button variant={"link"} size="icon" onClick={handleLikePost}>
                                    <HeartIcon fill={isLiked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "transparent"} className={isLiked ? "text-red-500" : ""} />
                                </Button>
                                <Button variant={"link"} size="icon" onClick={handleMessageBtn}>
                                    <Icon name="message-circle" />
                                </Button>
                                <Button variant={"link"} size="icon">
                                    <Icon name="send" />
                                </Button>
                            </div>
                            {/* <Button variant={"link"} size="icon">
                                <Icon name="bookmark" />
                            </Button> */}
                        </div>

                        {post?.likes && post?.likes.length > 0 && <LikeMessageGenerate likes={post?.likes} />}
                        <div className="flex flex-row items-center gap-1 text-sm px-2">
                            <p className="text-muted-foreground">{convertDate(post?.created_at)}</p>
                        </div>
                        <div className="flex w-full space-x-2 pt-4">
                            <InputWithEmoji
                                textAreaRef={commentInputRef}
                                content={commentContent}
                                setContent={setCommentContent}
                                placeholder="Add a comment?..."
                                containerClassName="flex-1"
                                textAreaClassName="resize-none h-4"
                                isShowLabel={false}
                                autoFocus
                            />
                            <Button variant="default" size="icon" className="" onClick={handleAddComment}>
                                <Icon name="send-horizontal" />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    // Mobile view
    return (
        <div className="">
            <PostSwiper postImages={post?.images_url || []} className={`overflow-hidden rounded-md ${isWidthGreaterThanHeight ? "h-[80vh] w-[80vh]" : "h-[90vw] w-[90vw]"}`} />
            <Drawer open={isOpenDrawerComment} onOpenChange={setIsOpenDrawerComment}>
                <DrawerTrigger className="w-full" asChild>
                    <Button variant={"ghost"}>
                        <div className="flex flex-col w-full justify-center items-center">
                            <ChevronUpIcon />
                            <p>Open Comments</p>
                        </div>
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh] px-1">
                    <div className="pt-2 xl:pt-0 px-0 pb-3 flex flex-col justify-between h-full lg:overflow-auto w-full">
                        <div className="flex flex-row justify-between items-center px-2">
                            <div className="flex flex-row items-center gap-2">
                                <AvatarContainer
                                    userId={post?.user?.id}
                                    avatar_url={post?.user?.avatar_url}
                                    hasStory={post?.user?.stories != undefined && post?.user?.stories?.length > 0}
                                    className="flex-none"
                                />
                                <p className="font-bold">{post?.user?.username}</p>
                            </div>
                            {post.user.id === user?.id && <PostMenuSelection post={post} userId={user?.id} />}
                        </div>
                        <Separator className="my-2" />
                        <div className="h-full flex flex-col overflow-y-scroll px-2">
                            {/* Comments Area */}
                            <div className="grow flex flex-col gap-2 text-sm">
                                <div className="flex flex-row">
                                    <div>
                                        <AvatarContainer
                                            userId={post?.user?.id}
                                            avatar_url={post?.user?.avatar_url}
                                            hasStory={post?.user?.stories != undefined && post?.user.stories?.length > 0}
                                        />
                                    </div>
                                    <div className="grow flex-col px-2">
                                        {/* Comment Information: username and date*/}
                                        <div className="flex flex-row gap-1 items-center">
                                            <p className="font-bold">{post?.user?.username}</p>
                                            <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                            <p className="text-xs">{convertDateWithShort(post?.created_at)}</p>
                                        </div>

                                        {/* comment content */}
                                        <p className="">{post?.description}</p>
                                    </div>
                                </div>
                                {post?.comments && post?.comments?.length > 0 && buildCommentTree(post?.comments).map((comment, index) => (
                                    <div key={index} className={`flex flex-row ${currentReplyCommentId === comment?.id ? replyingStyle : ""}`}>
                                        <div>
                                            <AvatarContainer
                                                userId={comment?.user?.id}
                                                avatar_url={comment?.user?.avatar_url}
                                                hasStory={comment?.user?.stories != undefined && comment?.user?.stories?.length > 0}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 w-full">
                                            {/* Parent comment */}
                                            <div className="flex flex-row break-all">
                                                <div className="flex-col px-2 w-full">
                                                    {/* Comment Information: username and date*/}
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <p className="font-bold">{comment?.user?.username}</p>
                                                        <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                                        <p className="text-xs">{convertDateWithShort(comment?.created_at)}</p>
                                                    </div>

                                                    {/* comment content */}
                                                    {/* <p className="max-w-full">{comment?.content}</p> */}
                                                    <div className="max-h-full" dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(comment?.content)} />
                                                    <div className="text-xs text-muted-foreground cursor-pointer flex flex-wrap gap-x-4">
                                                        <p className="hover:underline" onClick={() => handleReplyBtn(comment?.id, comment?.user?.username)}>Reply</p>
                                                        {comment.children && comment.children.length > 0 && (
                                                            <p className="hover:underline" onClick={() => toggleViewComments(comment.id)}>
                                                                {expandedComments[comment.id] ? 'Hide comments' : 'View comments'}
                                                            </p>
                                                        )}
                                                        {(comment?.user?.id === user?.id || post.user.id === user?.id) &&
                                                            // <p className="hover:underline" onClick={() => handleDeleteComment(comment.id)}>Delete</p>
                                                            <DeleteCommentDialog commentId={comment.id} />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <HeartIcon
                                                        fill={comment.is_liked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "transparent"}
                                                        className={`cursor-pointer ${comment.is_liked ? "text-red-500" : ""}`}
                                                        onClick={() => handleLikeComment(comment.id)}
                                                    />
                                                    <p className="text-xs">{comment?.likes && comment?.likes > 0 ? comment?.likes : ""}</p>
                                                </div>
                                            </div>

                                            {/* Child comments */}
                                            {expandedComments[comment.id] && comment.children &&
                                                generateChildComments({
                                                    comments: comment?.children,
                                                    user: user!,
                                                    index: index,
                                                    handleReplyBtn,
                                                    handleLikeComment,
                                                    expandedComments,
                                                    toggleViewComments,
                                                    post
                                                })
                                            }
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
                                    <Button variant={"link"} size="icon" onClick={handleLikePost}>
                                        <HeartIcon fill={isLiked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "transparent"} className={isLiked ? "text-red-500" : ""} />
                                    </Button>
                                    <Button variant={"link"} size="icon" onClick={handleMessageBtn}>
                                        <Icon name="message-circle" />
                                    </Button>
                                    <Button variant={"link"} size="icon">
                                        <Icon name="send" />
                                    </Button>
                                </div>
                                <Button variant={"link"} size="icon">
                                    <Icon name="bookmark" />
                                </Button>
                            </div>

                            {post?.likes && post?.likes.length > 0 && <LikeMessageGenerate likes={post?.likes} />}
                            <div className="flex flex-row items-center gap-1 text-sm px-2">
                                <p className="text-muted-foreground">{convertDate(post?.created_at)}</p>
                            </div>
                            <div className="flex w-full space-x-2 pt-4">
                                <InputWithEmoji
                                    textAreaRef={commentInputRef}
                                    content={commentContent}
                                    setContent={setCommentContent}
                                    placeholder="Add a comment?..."
                                    containerClassName="flex-1"
                                    textAreaClassName="resize-none h-4"
                                    isShowLabel={false}
                                    autoFocus
                                />
                                <Button variant="default" size="icon" className="" onClick={handleAddComment}>
                                    <Icon name="send-horizontal" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

function buildCommentTree(comments: Comment[]): Comment[] {
    const result: Comment[] = [];
    const map: { [key: number]: Comment[] } = {};

    comments.forEach(comment => {
        comment.children = [];
        if (comment.parent_id === 0 || !comment.parent_id) {
            result.push(comment);
        } else {
            if (!map[comment.parent_id!]) {
                map[comment.parent_id!] = [];
            }
            map[comment.parent_id!].push(comment);
        }
    });

    function addChildren(parent: Comment) {
        if (map[parent.id]) {
            parent.children = map[parent.id];
            parent.children.forEach(child => addChildren(child));
        }
    }

    result.forEach(rootComment => addChildren(rootComment));

    return result;
}

type ChildCommentProps = {
    user: User;
    comments: Comment[];
    index: number;
    handleReplyBtn: (commentId: number, receiverName: string) => void;
    handleLikeComment: (commentId: number) => void;
    expandedComments: { [key: number]: boolean };
    toggleViewComments: (commentId: number) => void;
    post: Post;
}

const generateChildComments: React.FC<ChildCommentProps> = ({
    comments,
    handleReplyBtn,
    handleLikeComment,
    expandedComments,
    user,
    toggleViewComments,
    post
}) => {
    return (
        comments?.map((comment: Comment, index: number) => (
            <div key={comment?.id} className={`flex flex-row w-full`}>
                <div>
                    <AvatarContainer
                        userId={comment?.user?.id}
                        avatar_url={comment?.user?.avatar_url}
                        hasStory={comment?.user?.stories != undefined && comment?.user?.stories?.length > 0}
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    {/* Parent comment */}
                    <div className="flex flex-row break-all">
                        <div className="flex-col px-2 w-full">
                            {/* Comment Information: username and date*/}
                            <div className="flex flex-row gap-1 items-center">
                                <p className="font-bold">{comment?.user?.username}</p>
                                <div className="rounded-full w-[5px] h-[5px] bg-slate-400 translate-y-[1px]"></div>
                                <p className="text-xs">{convertDateWithShort(comment?.created_at)}</p>
                            </div>

                            {/* comment content */}
                            {/* <p className="max-w-full">{comment?.content}</p> */}
                            <div className="max-h-full" dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(comment?.content)} />
                            <div className="text-xs text-muted-foreground cursor-pointer flex flex-wrap gap-x-4">
                                <p className="hover:underline" onClick={() => handleReplyBtn(comment?.id, comment?.user?.username)}>Reply</p>
                                {comment.children && comment.children.length > 0 && (
                                    <p className="hover:underline" onClick={() => toggleViewComments(comment.id)}>
                                        {expandedComments[comment.id] ? 'Hide comments' : 'View comments'}
                                    </p>
                                )}
                                {(comment?.user?.id === user?.id || post.user.id === user?.id) &&
                                    // <p className="hover:underline" onClick={() => handleDeleteComment(comment.id)}>Delete</p>
                                    <DeleteCommentDialog commentId={comment.id} />
                                }
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <HeartIcon
                                fill={comment.is_liked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "transparent"}
                                className={`cursor-pointer ${comment.is_liked ? "text-red-500" : ""}`}
                                onClick={() => handleLikeComment(comment.id)}
                            />
                            <p className="text-xs">{comment?.likes && comment?.likes > 0 ? comment?.likes : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        ))

    );
}

export default FloatPostItem;