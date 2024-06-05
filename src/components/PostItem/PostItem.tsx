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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { BookMarkedIcon, BookmarkIcon, EllipsisIcon, HeartIcon, MenuIcon, MessageCircleIcon, SendIcon, UserCircleIcon, UserRoundIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import FloatPostItem from "./FloatPostItem";
import PostSwiper from "../Swiper/PostSwiper";

type PostItemProps = {
    user: User;
    post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ user, post }) => {

    return (
        <Card className="flex flex-col">
            <div className="flex flex-row gap-2 py-1 px-2 justify-center items-center">
                <AvatarContainer avatar_url={user.avatar_url} hasStory={user.stories != undefined && user.stories?.length > 0} className="flex-none" />
                <div className="flex-auto flex flex-col justify-center">
                    <p>{user.username}</p>
                </div>
                <Button variant="link" size={"icon"}>
                    <EllipsisIcon />
                </Button>
            </div>

            <PostSwiper postImages={post.images} />

            {/* Interaction List */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <Button variant={"link"} size="icon">
                        <HeartIcon />
                    </Button>
                    <Dialog>
                        <DialogTrigger>
                            <MessageCircleIcon />
                        </DialogTrigger>
                        <DialogContent className="p-2 w-3/4" disableCloseBtn>
                            <FloatPostItem user={user} post={post} />
                        </DialogContent>
                    </Dialog>
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
                <div className="flex flex-row">
                    <div className="flex flex-row">
                        <UserRoundIcon className="bg-slate-200 rounded-full text-slate-500" />
                        <UserRoundIcon className="bg-stone-300 rounded-full text-stone-600 -translate-x-1/3" />
                    </div>
                    <div>
                        Liked by
                        <span className="font-bold">
                            {" "}jetsonn_ {" "}
                        </span>
                        and 15,375 others</div>
                </div>
                <span className="line-clamp-2"><span className="font-bold">{user.username}</span> My monday moments! If you are a developer, please help me answer this survey!</span>
                <span className="text-muted-foreground cursor-pointer text-sm hover:underline" onClick={() => { }}>View all 38 comments</span>
                <div className="flex flex-col" onClick={() => { }}>
                    <div className="flex flex-row gap-1">
                        <p className="font-bold">joshuaw_yaku</p>
                        <p className="line-clamp-1">哈哈哈哈哈</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <p className="font-bold">jetsonn_</p>
                        <p className="line-clamp-1">wtf is this? fsdsf sdfdsfsd fdsfsdfsd dsfdsfds dsfdsfsdf dsfdsfdsfsd dsfsdfds dsfsdfdsf dsfdsfsdf dfsdfsdfds dfsdfsd dsfsdfs</p>
                    </div>
                </div>
                <div className="flex w-full items-center space-x-2 pt-4">
                    <Dialog>
                        <DialogTrigger className="w-full">
                            <Input type="text" placeholder="Add comment" className="w-full" />
                        </DialogTrigger>
                        <DialogContent className="p-2 w-3/4" disableCloseBtn>
                            <FloatPostItem user={user} post={post} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

        </Card >
    );
}

export default PostItem;