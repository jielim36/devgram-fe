import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useGetPostsByUserId } from "@/hooks";
import { Post } from "@/types";
import PostCard from "./PostCard";

const Profile = () => {

    // path = profile/username , check the username from the path
    const { userId } = useParams();
    const { user } = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const { data: postData } = useGetPostsByUserId(Number(userId));
    const [posts, setPosts] = useState<Post[]>();

    useEffect(() => {
        if (user && user.id === Number(userId)) {
            setIsOwner(true);
        }
    }, [userId, user]);

    useEffect(() => {
        if (postData != undefined && postData?.data) {
            setPosts(postData.data)
        }
    }, [postData])


    return (
        <div className="w-full h-full px-40">

            {/* User Card */}
            <div className="grid grid-cols-6 max-h-72 h-full">

                {/* Avatar */}
                <div className="col-span-2 flex justify-center items-center">
                    <AvatarContainer
                        userId={user?.id}
                        avatar_url={user?.avatar_url}
                        hasStory={user?.stories != undefined && user?.stories?.length > 0 || true}
                        className="h-40 aspect-square"
                        avatarClassName="h-full w-full"
                        boldBorder
                    />
                </div>

                {/* User Info */}
                <div className="col-span-4 flex flex-col gap-4">

                    {/* Username and buttons */}
                    <div className="flex flex-row gap-2 items-center overflow-hidden">
                        <p className="text-lg font-semibold pr-4 truncate">
                            {user?.username}
                        </p>
                        {isOwner && <Button className="flex-none">Edit Profile</Button>}
                        {isOwner && <Button >Settings</Button>}
                        {isOwner &&
                            <Button variant="ghost" className="flex-none">
                                <Icon name="settings" />
                            </Button>
                        }
                        {!isOwner && <Button className="flex-none">Follow</Button>}
                        {!isOwner && <Button className="flex-none">Message</Button>}
                        {!isOwner &&
                            <Button variant="ghost" className="flex-none">
                                <Icon name="ellipsis" />
                            </Button>
                        }
                    </div>

                    {/* User information statistic: following, follower, post counts */}
                    <div className="flex flex-row gap-8 w-full">
                        <span>
                            <strong>
                                9,999
                            </strong>
                            {" "}
                            Post
                        </span>

                        <span>
                            <strong>
                                9,999
                            </strong>
                            {" "}
                            Following
                        </span>

                        <span>
                            <strong>
                                9,999
                            </strong>
                            {" "}
                            Follower
                        </span>
                    </div>

                    {/* Bio */}
                    <article className="grow text-ellipsis h-44 overflow-auto">
                        {content}
                    </article>
                </div>
            </div>

            {/* Stories */}
            <div className="flex flex-row gap-8 overflow-hidden py-2 px-6">
                {fakeStories?.map(() => {
                    return (
                        <AvatarContainer
                            avatar_url="https://images.unsplash.com/photo-1634015700144-9f8b1b5f0e7b"
                            hasStory={false}
                            avatarClassName="h-24 w-24"
                        />
                    )
                })}
            </div>

            {/* User posts Listing */}
            <Tabs defaultValue="posts" className="w-full mt-4 pb-8">
                <TabsList className="flex items-center mx-auto w-fit">
                    <TabsTrigger value="posts">
                        <div className="flex flex-row gap-1 items-center">
                            <Icon name="grid-2x2" />
                            Posts
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="reels">
                        <div className="flex flex-row gap-1 items-center">
                            <Icon name="clapperboard" />
                            Reels
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="grid grid-cols-3 gap-1">
                    {posts?.map((post) => {
                        return (
                            <PostCard
                                post={post}
                                userId={user?.id}
                                key={post.id}
                            />
                        )
                    })}
                </TabsContent>
                <TabsContent value="reels">Still under developing...</TabsContent>
            </Tabs>
        </div>
    );
}

const fakeStories = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
]

const content = <>                        IG: jielim36
    <br />
    Software Engineer
    <br />

    dfd

    <br />
    df
    d
    fd

    <br />
    fd
    f
    <br />
    df
    d
    fd
    fd
    <br />
    f
    <br />
    df
    <br />
    d
    <br />
    fd
    <br />
    fd
</>

export default Profile; 