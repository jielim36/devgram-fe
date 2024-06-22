import { Skeleton } from "../ui/skeleton";


const ProfileSkeleton = () => {
    return (
        <div className="w-full h-full px-4 sm:px-14 xl:px-40">

            <div className="
                flex flex-col gap-4
                md:grid md:grid-cols-6 md:max-h-72 md:h-full"
            >

                {/* Avatar */}
                <div className="
                    flex flex-row gap-3
                    md:col-span-2 md:flex md:justify-center md:items-center"
                >
                    <Skeleton
                        className="h-20 md:h-40 aspect-square rounded-full"
                    />

                    <div className="block md:hidden">
                        <Skeleton className="w-1/2 h-6" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="w-1/3 h-6" />
                            <Skeleton className="w-1/3 h-6" />
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="md:col-span-4 flex flex-col gap-4">

                    {/* Username and buttons */}
                    <div className="hidden md:flex flex-row gap-2 items-center overflow-hidden">
                        <Skeleton className="w-1/3 h-6" />
                        <Skeleton className="w-24 h-16" />
                        <Skeleton className="w-24 h-16" />
                    </div>

                    {/* User information statistic: following, follower, post counts */}
                    <div className="flex flex-row gap-8 w-full">
                        <Skeleton className="w-28 h-8" />
                        <Skeleton className="w-28 h-8" />
                        <Skeleton className="w-28 h-8" />
                    </div>

                    {/* Bio */}
                    <Skeleton className="h-full" />
                </div>
            </div>

            <div className="w-full mt-20 pb-8 grid grid-cols-3 gap-2">
                <Skeleton className="aspect-square" />
                <Skeleton className="aspect-square" />
                <Skeleton className="aspect-square" />
            </div>
        </div>
    );
}

export default ProfileSkeleton;