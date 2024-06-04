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
import { BookMarkedIcon, BookmarkIcon, HeartIcon, MenuIcon, MessageCircleIcon, SendIcon, UserCircleIcon, UserRoundIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
type PostItemProps = {
    user: User;
    post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ user, post }) => {

    const totalImages = post.images.length;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const setCurrentIndex = (index: number) => {
        setCurrentImageIndex(index);
    }

    return (
        <Card className="flex flex-col">
            <div className="flex flex-row gap-2 p-1 justify-center items-center">
                <AvatarContainer avatar_url={user.avatar_url} hasStory={user.stories != undefined && user.stories?.length > 0} className="flex-none" />
                <div className="flex-auto flex flex-col justify-center">
                    <p>{user.username}</p>
                </div>
                <Button variant="link" size={"icon"}>
                    <MenuIcon />
                </Button>
            </div>
            <Carousel className="relative" setCurrentIndex={setCurrentIndex}>
                <CarouselContent className="select-none">
                    {post.images.map((image, index) => (
                        <CarouselItem key={index}>
                            <img src={image} alt="post" className="w-full h-[300px] object-cover" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {totalImages > 1 && (
                    <Badge className="absolute top-2 right-2">{currentImageIndex + 1}/{totalImages}</Badge>
                )}
                {/* <CarouselPrevious />
                <CarouselNext /> */}
            </Carousel>

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

            {/* Information */}
            <div className="px-3 pb-3 flex flex-col">
                <div className="flex flex-row">
                    <div className="flex flex-row">
                        <UserRoundIcon className="bg-slate-200 rounded-full text-slate-500" />
                        <UserRoundIcon className="bg-stone-300 rounded-full text-stone-600 -translate-x-1/3" />
                    </div>
                    <span>Liked by jetsonn_ and 15,375 others</span>
                </div>
                <span>{user.username} My monday moments!</span>
                <span className="text-muted-foreground">View all 38 comments</span>
                <div className="flex flex-col">
                    <span>joshuaw_yaku 哈哈哈哈哈</span>
                    <span>jetsonn_ wtf is this?</span>
                </div>
            </div>

        </Card >
    );
}

export default PostItem;