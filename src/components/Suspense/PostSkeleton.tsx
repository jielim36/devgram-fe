import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
    return (
        <div className="relative w-full h-full left-2/4 -translate-x-2/4 lg:-translate-x-3/4">
            <Skeleton className="aspect-reel w-[300px] xs:w-[400px]" />
        </div>
    );
}

export default PostSkeleton;