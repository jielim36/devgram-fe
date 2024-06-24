import { queryClient } from "@/app/App";
import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
import { FOLLOW_QUERY_KEY } from "@/constants";
import { useAddFollow, useGetFollowerList, useGetFollowingList, useGetInfiniteFollowerList, useGetInfiniteFollowingList, useUnFollow } from "@/hooks";
import { User } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
import toast from "react-hot-toast";
import { useIntersection } from "@mantine/hooks";

type FollowingListingProps = {
    me?: User;
    userId: number;
    trigger: React.ReactNode;
    mode: "follower" | "following";
    followerCount: number;
    followingCount: number;
};

const FollowListingDialog: React.FC<FollowingListingProps> = ({
    me,
    userId,
    trigger,
    mode,
    followerCount,
    followingCount
}) => {

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isNoRecordFound, setIsNoRecordFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lastFollowRef = useRef<HTMLDivElement | null>(null);
    const { ref, entry } = useIntersection({
        root: lastFollowRef.current,
        threshold: 1,
    });

    // Pagination
    const followingListResult = useGetInfiniteFollowingList({
        following_id: userId,
        enabled: isOpenDialog && mode === "following"
    });
    const followerListResult = useGetInfiniteFollowerList({
        follower_id: userId,
        enabled: isOpenDialog && mode === "follower"
    });

    useEffect(() => {

        setIsNoRecordFound(
            (mode == "following" && followingListResult?.isSuccess && followingListResult?.data?.pages[0]?.data?.length === 0)
            ||
            (mode === "follower" && followerListResult?.isSuccess && followerListResult?.data?.pages[0]?.data?.length === 0)
        );

        setIsLoading(
            followerListResult?.isFetchingNextPage
            ||
            followingListResult?.isFetchingNextPage
        );

    }, [followerListResult]);

    const handleLoadMore = () => {
        const itemsPerPage = 15;

        if (mode === "following") {
            const totalFollowingPages = Math.ceil(followingCount / itemsPerPage);

            if (followingListResult?.data?.pages?.length >= totalFollowingPages || followingListResult?.isFetchingNextPage) {
                return;
            }
            followingListResult.fetchNextPage();

        } else if (mode === "follower") {

            const totalFollowerPages = Math.ceil(followerCount / itemsPerPage);

            if (followerListResult?.data?.pages?.length >= totalFollowerPages || followerListResult?.isFetchingNextPage) {
                return;
            }
            followerListResult.fetchNextPage();

        }
    }

    if (entry?.isIntersecting) {
        handleLoadMore();
    }

    const _followList = mode === "follower" ?
        followerListResult.data.pages.flatMap((page) => page.data)
        :
        followingListResult.data.pages.flatMap((page) => page.data);

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger onClick={() => setIsOpenDialog(true)}>
                {trigger}
            </DialogTrigger>
            <DialogContent
                className="w-5/6 sm:w-[500px] max-h-[500px] "
            >
                <DialogHeader>
                    <DialogTitle>Following List</DialogTitle>
                </DialogHeader>
                <Separator />
                {isNoRecordFound
                    && <p className="text-center text-muted-foreground">No {mode === "follower" ? "follower" : "following"} found</p>
                }

                {!isNoRecordFound &&
                    <div className="flex flex-col gap-2 py-1 w-full overflow-y-auto max-h-[400px] pr-1">
                        {_followList.map((user, index) => (
                            <UserCard
                                ref={index === _followList.length - 1 ? ref : undefined}
                                key={user.id}
                                user={user} me={me!}
                            />
                        ))}

                        {/* Loading Spinner */}
                        {isLoading && (
                            <div className="flex justify-center">
                                <Icon name="loader-circle" className="animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                }

            </DialogContent>
        </Dialog>
    );
}

type UserCardProps = {
    user: User;
    me: User;
}

const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(({ user, me }, ref) => {

    const addFollowMutation = useAddFollow({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEY.concat(me.id.toString(), "followingCount") });
            user.is_following = true;
        }
    });
    const unFollowMutation = useUnFollow({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEY.concat(me.id.toString(), "followingCount") });
            user.is_following = false;
        }
    });

    const handleFollow = (follow_id: number, type: "follow" | "unfollow") => {
        if (me == undefined || !me?.id) return;

        if (type === "follow") {
            toast.promise(addFollowMutation.mutateAsync({ follower_id: me?.id, following_id: follow_id }), {
                loading: "Following...",
                success: "Followed",
                error: "Failed to follow"
            });
        } else {
            toast.promise(unFollowMutation.mutateAsync({ follower_id: me?.id, following_id: follow_id }), {
                loading: "Unfollowing...",
                success: "Unfollowed",
                error: "Failed to unfollow"
            });
        }
    }

    return (
        <div ref={ref} className="flex flex-row gap-2 items-center">
            <AvatarContainer
                userId={user.id}
                avatar_url={user.avatar_url}
                hasStory={user?.stories != undefined && user?.stories?.length > 0}
                className="flex-none w-fit"
            />
            <div className="grid grid-cols-4 gap-2 items-center w-full">
                <p className="col-span-3 font-semibold text-left flex flex-row gap-1 truncate">
                    {user.username}
                    {me?.id === user.id && <span className="text-muted-foreground">(You)</span>}
                </p>
                {me?.id !== user.id &&
                    <Button
                        variant={user.is_following ? "outline" : "default"}
                        className="w-20 place-self-end"
                        onClick={() => handleFollow(user.id, user.is_following ? "unfollow" : "follow")}
                    >
                        {user.is_following ? "Unfollow" : "Follow"}
                    </Button>
                }
            </div>
        </div>
    );
});

export default FollowListingDialog;