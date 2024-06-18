import { queryClient } from "@/app/App";
import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
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
import { useAddFollow, useGetFollowerList, useGetFollowingList, useUnFollow } from "@/hooks";
import { User } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type FollowingListingProps = {
    me?: User;
    userId: number;
    trigger: React.ReactNode;
    mode: "follower" | "following";
};

const FollowListingDialog: React.FC<FollowingListingProps> = ({
    me,
    userId,
    trigger,
    mode,
}) => {

    const [currentPage, setCurrentPage] = useState(0);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [followList, setFollowingList] = useState<User[]>([]);
    const { data: followerListData } = useGetFollowerList({
        follower_id: userId,
        pages: currentPage,
        enabled: isOpenDialog && mode === "follower"
    });
    const { data: followingListData } = useGetFollowingList({
        following_id: userId,
        pages: currentPage,
        enabled: isOpenDialog && mode === "following"
    });

    useEffect(() => {
        if (mode === "following" && followingListData?.data != undefined) {
            setFollowingList(followingListData?.data);
        } else if (mode === "follower" && followerListData?.data != undefined) {
            setFollowingList(followerListData?.data);
        }
    }, [followingListData, followerListData]);

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
                {(!followList || followList?.length === 0) && (followerListData?.data || followingListData?.data)
                    && <p className="text-center">No {mode === "follower" ? "follower" : "following"} found</p>
                }
                <div className="flex flex-col gap-2 py-1 w-full">
                    {followList != undefined && followList.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user} me={me!}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

const UserCard = ({ user, me }: { user: User, me: User, }) => {

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
        <div className="flex flex-row gap-2 items-center">
            <AvatarContainer
                userId={user.id}
                avatar_url={user.avatar_url}
                hasStory={user?.stories != undefined && user?.stories?.length > 0}
                className="flex-none w-fit"
            />
            <div className="grid grid-cols-4 gap-2 items-center">

                <p className="col-span-3 font-semibold text-left flex flex-row gap-1 truncate">
                    {user.username} dfsdafdsfdfsdf dfsdfsdfsdfsdf sdfsdfsdfsdfsd sdfsdfsdfs
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
}

export default FollowListingDialog;