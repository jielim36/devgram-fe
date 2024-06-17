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
import { useAddFollow, useGetFollowerCount, useGetFollowingCount, useGetPostsByUserId, useGetUserByUserId, useIsFollowing, useUnFollow } from "@/hooks";
import { FollowList, Post, User } from "@/types";
import PostCard from "./PostCard";
import toast from "react-hot-toast";
import FollowingListingDialog from "./FollowingListingDialog";

const Profile = () => {

    // path = profile/username , check the username from the path
    const { userId } = useParams();
    const { user: me } = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [user, setUser] = useState<User>();
    const [posts, setPosts] = useState<Post[]>();
    const [followCount, setFollowCount] = useState<FollowList>({
        followerCount: 0,
        followingCount: 0
    });

    const { data: postData } = useGetPostsByUserId(Number(userId));
    const { data: userData } = useGetUserByUserId(Number(userId));
    const { data: followingCountData } = useGetFollowingCount({ following_id: Number(userId) });
    const { data: followerCountData } = useGetFollowerCount({ follower_id: Number(userId) });

    const { data: isFollowingData } = useIsFollowing({
        follower_id: me!.id,
        following_id: Number(userId),
        enabled: !isOwner && me?.id != undefined
    });

    const addFollowMutation = useAddFollow({
        onSuccess: () => {
            setIsFollowing(true);
        }
    });

    const unFollowMutation = useUnFollow({
        onSuccess: () => {
            setIsFollowing(false);
        }
    });


    useEffect(() => {
        if (me && me.id === Number(userId)) {
            setIsOwner(true);
        }
    }, [userId, user]);

    useEffect(() => {
        if (isFollowingData != undefined && isFollowingData?.data) {
            setIsFollowing(isFollowingData.data);
        }
    }, [isFollowingData]);

    useEffect(() => {
        if (postData != undefined && postData?.data) {
            setPosts(postData.data)
        }
    }, [postData])

    useEffect(() => {
        if (userData != undefined && userData?.data) {
            setUser(userData.data)
        }
    }, [userData]);

    useEffect(() => {
        if (followingCountData != undefined && followingCountData?.data) {
            setFollowCount(prev => ({ ...prev, followingCount: followingCountData.data }));
        }

        if (followerCountData != undefined && followerCountData?.data) {
            setFollowCount(prev => ({ ...prev, followerCount: followerCountData.data }));
        }
    }, [followingCountData, followerCountData]);

    const handleFollow = () => {
        if (isOwner) return;
        if (addFollowMutation.isPending || unFollowMutation.isPending) return;

        if (isFollowing) {
            toast.promise(unFollowMutation.mutateAsync({ follower_id: me!.id, following_id: Number(userId) }), {
                loading: "Unfollowing...",
                success: "Unfollowed",
                error: "Failed to unfollow"
            });
        } else {
            toast.promise(addFollowMutation.mutateAsync({ follower_id: me!.id, following_id: Number(userId) }), {
                loading: "Following...",
                success: "Followed",
                error: "Failed to follow"
            });
        }
    }


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
                        {!isOwner && <Button className="flex-none" onClick={handleFollow}>{isFollowing ? "Unfollow" : "Follow"}</Button>}
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
                                {posts?.length || 0}
                            </strong>
                            {" "}
                            Post
                        </span>
                        <FollowingListingDialog userId={Number(userId)} trigger={
                            <span className="hover:underline cursor-pointer w-fit">
                                <strong>
                                    {followCount?.followingCount || 0}
                                </strong>
                                {" "}
                                Following
                            </span>
                        } />

                        <span className="hover:underline cursor-pointer">
                            <strong>
                                {followCount?.followerCount || 0}
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
        </div >
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