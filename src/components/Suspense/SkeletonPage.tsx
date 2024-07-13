import { matchPath, useLocation, useMatch } from "react-router-dom"
import PostSkeleton from "./PostSkeleton";
import ProfileSkeleton from "./ProfileSkeleton";
import { routes } from "@/app/Routes";
import { useEffect } from "react";
import ReelSkeleton from "./ReelSkeleton";

const SkeletonPage = () => {

    const matchProfile = useMatch(routes.profile);
    const matchHome = useMatch(routes.home);
    const matchFollowing = useMatch(routes.following);
    const matchReels = useMatch(routes.reels);

    const renderSkeleton = () => {
        if (matchHome) {
            return <PostSkeleton />;
        } else if (matchProfile) {
            return <ProfileSkeleton />;
        } else if (matchFollowing) {
            return <PostSkeleton />;
        } else if (matchReels) {
            return <ReelSkeleton />;
        }
    };

    return (
        <div className="relative w-full h-full overflow-y-auto py-8">
            {renderSkeleton()}
        </div>
    );

}

export default SkeletonPage;