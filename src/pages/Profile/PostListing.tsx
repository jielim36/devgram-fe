import { Post, ResponseBody, User } from "@/types";
import PostCard from "./PostCard";
import Icon from "@/components/Icon/Icon";
import { useEffect } from "react";
import { AxiosError } from "axios";

type PostListingProps = {
    posts: Post[] | undefined;
    user: User | undefined;
    allowToViewProfile: boolean;
    error: Error | null;
    isError: boolean;
}

const PostListing: React.FC<PostListingProps> = ({
    posts,
    user,
    allowToViewProfile,
    error,
    isError
}) => {

    const getErrorMsg = () => {
        const err = error as AxiosError;
        const errMsg = err?.response?.data as ResponseBody<string>;
        const result = errMsg?.data;
        return result;
    }

    if (posts?.length === 0) {
        return <div className="w-full xs:py-14 text-muted-foreground flex flex-col items-center justify-center">
            <Icon name="camera-off" className="w-10 h-10 font-light mb-2" />
            <p className="text-xl font-semibold">No posts yet</p>
        </div>
    }

    if (!allowToViewProfile) {
        return (
            <div className="w-full py-10 text-muted-foreground flex flex-col items-center justify-center">
                <Icon name="ban" className="w-10 h-10 font-light" />
                <p className="">{isError && error ? getErrorMsg() : "You are not allowed to access this profile"}</p>
            </div>
        );
    }

    if (posts && user)
        return (
            <div className="grid grid-cols-3 gap-1">
                {posts?.map((post: Post) => {
                    return (
                        <PostCard
                            post={post}
                            userId={user?.id}
                            key={post.id}
                        />
                    )
                })}
            </div>
        );
}

export default PostListing;