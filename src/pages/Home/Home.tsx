import PostItem from "@/components/PostItem/PostItem";
import { Post } from "@/types";
import { useGetPopularPosts } from "@/hooks";
import PostSkeleton from "@/components/Suspense/PostSkeleton";


const Home = () => {

    const { data: postData } = useGetPopularPosts();

    return (
        <>
            <div className="relative w-[340px] sm:w-[530px] left-2/4 -translate-x-2/4 lg:-translate-x-3/4 pb-24">
                {/* Post Listing */}
                <div className="flex flex-col gap-16">
                    {postData?.data && postData?.data?.length > 0 && postData.data.map((post: Post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );

}

export default Home;