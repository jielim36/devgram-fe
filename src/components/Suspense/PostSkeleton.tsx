import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
    return (
         <div className="relative w-[340px] sm:w-[530px] h-[500px] left-2/4 -translate-x-2/4 lg:-translate-x-3/4">
            <Card className="flex flex-col h-full">

                {/* User Info: avatar and username */}
                <div className="flex-none flex flex-row gap-2 p-2">
                    <Skeleton className="rounded-full h-[36px] aspect-square" />
                    <Skeleton className="w-1/3 h-full" />
                </div>

                {/* Images Swiper */}
                <Skeleton className="aspect-square grow rounded-none" />
            </Card>
        </div>
    );
}

export default PostSkeleton;