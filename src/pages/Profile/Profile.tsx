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
import { useAddFollow, useGetFollowerCount, useGetFollowingCount, useGetPostsByUserId, useGetUserByUserId, useGetUserInfoByUserId, useIsFollowing, useUnFollow } from "@/hooks";
import { FollowList, Post, ResponseBody, User } from "@/types";
import PostCard from "./PostCard";
import toast from "react-hot-toast";
import FollowListingDialog from "./FollowListingDialog";
import DOMPurify from 'dompurify';
import { userInfo } from "os";
import { EditProfileDrawer, EditProfileDialog } from "./EditProfile";
import { Badge } from "@/components/ui/badge";
import { calculateAge } from "@/utils/formatDate";
import { SettingSheet, SettingDrawer } from "./Settings";
import { AxiosError } from "axios";


const Profile = () => {

    // path = profile/username , check the username from the path
    const { userId } = useParams();
    const { user: me } = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [user, setUser] = useState<User>();
    const [posts, setPosts] = useState<Post[]>();
    const [allowedToViewProfile, setAllowedToViewProfile] = useState(true);

    const { data: postData, isError: isGetPostError, error: getPostError } = useGetPostsByUserId({
        userId: Number(userId),
        enabled: !!allowedToViewProfile
    });
    const { data: userData } = useGetUserByUserId(Number(userId));
    const { data: followingCountData } = useGetFollowingCount({ following_id: Number(userId) });
    const { data: followerCountData } = useGetFollowerCount({ follower_id: Number(userId) });
    const { data: userInfoData } = useGetUserInfoByUserId(Number(userId));

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
        if (isGetPostError) {
            const error = getPostError as AxiosError;
            const data = error?.response?.data as ResponseBody<string>;
            if (data.data === "Not allowed to access this profile") {
                setAllowedToViewProfile(false);
            }

            // setAllowedToViewProfile(false);
        }
    }, [isGetPostError]);

    const renderBioWithLinksAndBreaks = (bio: string | undefined) => {
        // Sanitize the bio using DOMPurify
        const sanitizedBio = DOMPurify.sanitize(bio || "");

        // Convert URLs into anchor tags
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const linkStyle = "text-blue-500 hover:underline cursor-pointer";
        const withLinks = sanitizedBio.replace(urlRegex, (url) => {
            return `<a href="${url}" class="${linkStyle}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });

        // Convert newlines to <br>
        const withLineBreaks = withLinks.replace(/\n/g, '<br>');

        // Return as dangerouslySetInnerHTML safe string
        return { __html: withLineBreaks };
    }

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
        <div className="w-full h-full px-4 sm:px-14 xl:px-40">

            {/* User Card */}
            <div className="
                flex flex-col gap-4
                md:grid md:grid-cols-6 md:max-h-72 md:h-full"
            >

                {/* Avatar */}
                <div className="
                    flex flex-row gap-3
                    md:col-span-2 md:flex md:justify-center md:items-center"
                >
                    <AvatarContainer
                        userId={user?.id}
                        avatar_url={user?.avatar_url}
                        hasStory={user?.stories != undefined && user?.stories?.length > 0 || true}
                        className="w-1/4 md:w-auto md:h-40 aspect-square"
                        avatarClassName="h-full w-full"
                        boldBorder
                        fallbackStrokeWidth={0.7}
                        fallbackClassName="w-full h-full"
                    />

                    {/* User Info for Mobile */}
                    <div className="w-3/4 h-fit flex flex-row justify-between items-center md:hidden">
                        <p className="text-lg font-semibold pr-4 truncate">
                            {user?.username}
                        </p>
                        {!isOwner &&
                            <Button variant="ghost" className="flex-none">
                                <Icon name="ellipsis" />
                            </Button>
                        }
                        {/* <div className="flex flex-wrap gap-2">
                            {isOwner &&
                                <EditProfileDrawer
                                    user={me!}
                                    userInfo={userInfoData?.data}
                                />
                            }
                            {isOwner &&
                                <SettingDrawer />
                            }
                            {!isOwner && <Button className="flex-none" onClick={handleFollow}>{isFollowing ? "Unfollow" : "Follow"}</Button>}
                            {!isOwner && <Button className="flex-none">Message</Button>}
                            {!isOwner &&
                                <Button variant="ghost" className="flex-none">
                                    <Icon name="ellipsis" />
                                </Button>
                            }
                        </div> */}
                    </div>
                </div>

                {/* User Info*/}
                <div className="md:col-span-4 flex flex-col gap-4 h-full">

                    {/* Username and buttons for Computer */}
                    <div className="hidden md:flex flex-row gap-2 items-center overflow-hidden">
                        <p className="text-lg font-semibold pr-4 truncate">
                            {user?.username}
                        </p>
                        {isOwner &&
                            <EditProfileDialog
                                user={me!}
                                userInfo={userInfoData?.data}
                            />
                        }
                        {/* {isOwner && <Button >Settings</Button>} */}
                        {isOwner &&
                            <SettingSheet />
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
                        {followingCountData?.data !== undefined && followerCountData?.data != undefined &&
                            <FollowListingDialog
                                me={me!}
                                userId={Number(userId)}
                                mode="following"
                                followingCount={followingCountData.data || 0}
                                followerCount={followerCountData.data || 0}
                                trigger={
                                    <span className="hover:underline cursor-pointer w-fit">
                                        <strong>
                                            {followingCountData?.data || 0}
                                        </strong>
                                        {" "}
                                        Following
                                    </span>
                                }
                            />
                        }

                        {followerCountData?.data !== undefined && followerCountData?.data != undefined &&
                            <FollowListingDialog
                                me={me!}
                                userId={Number(userId)}
                                mode="follower"
                                followerCount={followerCountData?.data || 0}
                                followingCount={followingCountData?.data || 0}
                                trigger={
                                    <span className="hover:underline cursor-pointer">
                                        <strong>
                                            {followerCountData?.data || 0}
                                        </strong>
                                        {" "}
                                        Follower
                                    </span>
                                } />
                        }
                    </div>
                    <div className="flex-none flex flex-wrap gap-3 select-none">
                        {userInfoData?.data?.gender && (
                            <Badge variant="secondary">
                                Gender: {userInfoData?.data?.gender}
                            </Badge>
                        )}
                        {userInfoData?.data?.birthday && (
                            <Badge variant="secondary">
                                Age: {calculateAge(userInfoData?.data?.birthday)}
                            </Badge>

                        )}
                        {userInfoData?.data?.address && (
                            <Badge variant="secondary">
                                Location: {userInfoData?.data?.address}
                            </Badge>
                        )}
                    </div>

                    {/* Bio */}
                    <article className="grow text-ellipsis max-h-44 overflow-auto">
                        <div dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(userInfoData?.data?.bio)} />
                        {!userInfoData?.data?.bio && <p className="text-muted-foreground">No Bio</p>}
                    </article>
                </div>
            </div>

            {/* Stories */}
            {/* <div className="flex flex-row gap-8 overflow-hidden py-2 px-6">
                {fakeStories?.map(() => {
                    return (
                        <AvatarContainer
                            avatar_url="https://images.unsplash.com/photo-1634015700144-9f8b1b5f0e7b"
                            hasStory={false}
                            avatarClassName="h-24 w-24"
                        />
                    )
                })}
            </div> */}

            {/* User posts Listing */}
            {allowedToViewProfile &&
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
                    {!posts &&
                        <div className="w-full py-10 text-muted-foreground flex flex-col items-center justify-center">
                            <Icon name="loader-circle" className="animate-spin mx-auto" />
                        </div>
                    }
                    <TabsContent value="reels">Still under developing...</TabsContent>
                </Tabs>
            }

            {!allowedToViewProfile &&
                <div className="w-full py-10 text-muted-foreground flex flex-col items-center justify-center">
                    <Icon name="ban" className="w-10 h-10 font-light" />
                    <p className="text-xl">You are not allowed to access this profile</p>
                </div>
            }

            {posts?.length === 0 &&
                <div className="w-full xs:py-14 text-muted-foreground flex flex-col items-center justify-center">
                    <Icon name="camera-off" className="w-10 h-10 font-light mb-2" />
                    <p className="text-xl font-semibold">No posts yet</p>
                </div>
            }
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

export default Profile; 