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
import { useGetFollowingList } from "@/hooks";
import { User } from "@/types";
import { useEffect, useState } from "react";

type FollowingListingProps = {
    userId: number;
    trigger: React.ReactNode;
};

const FollowingListingDialog: React.FC<FollowingListingProps> = ({
    userId,
    trigger,
}) => {

    const [currentPage, setCurrentPage] = useState(0);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [followingList, setFollowingList] = useState<User[]>([]);
    const { data: followingListData } = useGetFollowingList({
        following_id: userId,
        pages: 0,
        enabled: isOpenDialog
    });

    useEffect(() => {
        console.log(followingListData?.data);

        if (followingListData?.data != undefined) {
            setFollowingList(followingListData?.data);
            console.log(followingListData?.data);
        }
    }, [followingListData]);

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger onClick={() => setIsOpenDialog(true)}>
                {trigger}
            </DialogTrigger>
            <DialogContent
                className="min-w-[300px] w-[500px]"
            >
                <DialogHeader>
                    <DialogTitle>Following List</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-3 py-1">
                            {followingList != undefined && followingList.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

const UserCard = ({ user }: { user: User }) => {

    return (
        <div className="flex flex-row gap-2 items-center">
            <AvatarContainer avatar_url={user.avatar_url} hasStory={user?.stories != undefined && user?.stories?.length > 0} />
            <p className="font-semibold grow">{user.username}</p>
            <Button>{user.is_following ? "Unfollow" : "Follow"}</Button>
        </div>
    );
}

export default FollowingListingDialog;