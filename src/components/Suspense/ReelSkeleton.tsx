import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ReelSkeleton = () => {
    return (
        <div className="relative w-full h-full">
            <Skeleton className="absolute left-2/4 -translate-x-2/4 lg:-translate-x-3/4 aspect-reel w-[300px] xs:w-[400px]" />
        </div>
    );
}

export default ReelSkeleton; 