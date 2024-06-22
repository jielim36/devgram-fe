import { matchPath, useLocation, useMatch } from "react-router-dom"
import PostSkeleton from "./PostSkeleton";
import ProfileSkeleton from "./ProfileSkeleton";
import { routes } from "@/app/Routes";
import { useEffect } from "react";

const SkeletonPage = () => {

    const matchProfile = useMatch(routes.profile);
    const matchHome = useMatch(routes.home);

    const renderSkeleton = () => {
        if (matchHome) {
            return <PostSkeleton />;
        } else if (matchProfile) {
            return <ProfileSkeleton />;
        }
    };

    return (
        <div className="relative w-full h-full overflow-y-auto py-8">
            {renderSkeleton()}
        </div>
    );

}

export default SkeletonPage;