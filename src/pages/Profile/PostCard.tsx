import Icon from "@/components/Icon/Icon";
import FloatPostItem from "@/components/PostItem/FloatPostItem";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Post } from "@/types";

type PostCardProps = {
    post: Post;
    userId?: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, userId }) => {

    const isLiked = userId && post.likes?.some(like => like.user.id === userId);

    return (
        <FloatPostItem postId={post.id} trigger={
            <AspectRatio ratio={1} className="relative rounded-sm overflow-hidden">
                <img src={post.images_url[0]} className="w-full h-full" />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex flex-row gap-6 items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 text-white">
                    <div className="flex flex-row gap-1">
                        <Icon
                            name="heart"
                            fill={isLiked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "white"}
                            color={isLiked ? "rgb(239 68 68 / var(--tw-text-opacity))" : "white"}
                        />
                        <p>{post.likes?.length}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <Icon name="message-circle" fill="white" />
                        <p>{post.comments?.length}</p>
                    </div>
                </div>
            </AspectRatio>
        } />
    );
}

export default PostCard;