import { Post, User } from "@/types";
import { Card } from "../ui/card";
import AvatarContainer from "../AvatarContainer/AvatarContainer";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "../ui/button";
import { BookMarkedIcon, BookmarkIcon, EllipsisIcon, HeartIcon, MenuIcon, MessageCircleIcon, SendHorizonalIcon, SendIcon, UserCircleIcon, UserRoundIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import PostSwiper from "../Swiper/PostSwiper";
import "@/style/color.css"
import { Separator } from "../ui/separator";

type FloatPostItemProps = {
    user: User;
    post: Post;
}

type CommentType = {
    user: User;
    comment: string;
}

const FloatPostItem: React.FC<FloatPostItemProps> = ({ user, post }) => {

    const comments: CommentType[] = [
        {
            user: {
                id: 1,
                username: "Lim Yee Jie",
                avatar_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg",
                is_active: true,
                stories: [
                    {
                        id: 1,
                        image_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg"
                    }
                ],
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
            comment: "hahahahahah what is that?"
        },
        {
            user: {
                id: 2,
                username: "Kaiyang",
                avatar_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                is_active: true,
                stories: [
                    {
                        id: 1,
                        image_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg"
                    }
                ],
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
            comment: "fjlsdkfjlasdfjlds fdsf dfsdfds fdsfsdfds dfsdf sdfkdsljfdskjfl fdskfjsdfsdlfk dsflkjldfjsd?"
        },
    ];

    return (
        <div className=" flex flex-col sm:flex-row">
            <PostSwiper postImages={post.images} className="grow w-full sm:w-2/3 aspect-square overflow-hidden rounded-md" />

            {/* Information */}
            <div className="px-3 pb-3 flex flex-col justify-between">
                <div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-2">
                            <AvatarContainer avatar_url={user.avatar_url} hasStory={user.stories != undefined && user.stories?.length > 0} className="flex-none" />
                            <p className="font-bold">{user.username}</p>
                        </div>
                        <EllipsisIcon />
                    </div>
                    <Separator className="my-2" />

                    {/* Comments Area */}
                    <div className="grow flex flex-col gap-2 text-sm">
                        <div className="flex flex-row gap-2">
                            <div>
                                <AvatarContainer
                                    avatar_url={user.avatar_url}
                                    hasStory={user.stories != undefined && user.stories?.length > 0}
                                    className="flex-none"
                                />
                            </div>
                            <p className="py-1">
                                <strong>{user.username}</strong> {post.description}
                            </p>
                        </div>
                        {comments.map((comment, index) => (
                            <div key={index} className="flex flex-row gap-2">
                                <div>
                                    <AvatarContainer
                                        avatar_url={comment.user.avatar_url}
                                        hasStory={comment.user.stories != undefined && comment.user.stories?.length > 0}
                                        className="flex-none"
                                    />
                                </div>
                                <p className="py-1">
                                    <strong>{comment.user.username}</strong> {comment.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    {/* Interaction List */}
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-2">
                            <Button variant={"link"} size="icon">
                                <HeartIcon />
                            </Button>
                            <Button variant={"link"} size="icon">
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

                    <div className="flex flex-row mt-2 text-sm">
                        <div className="flex flex-row">
                            <UserRoundIcon className="bg-slate-200 rounded-full text-slate-500" />
                            <UserRoundIcon className="bg-stone-300 rounded-full text-stone-600 -translate-x-1/3" />
                        </div>
                        <div>
                            Liked by <span className="font-bold">jetsonn_</span> and 15,375 others
                        </div>
                    </div>
                    <div className="flex w-full items-center space-x-2 pt-4">
                        <Input type="text" placeholder="Add comment" autoFocus className="flex-1" onClick={() => {
                            console.log("Commenting");
                        }} />
                        <Button variant="default" size="icon" className="">
                            <SendHorizonalIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FloatPostItem;