import PostItem from "@/components/PostItem/PostItem";
import { Post } from "@/types";
import { useGetPopularPosts } from "@/hooks";
import Icon from "@/components/Icon/Icon";


const Home = () => {

    const { data: postData } = useGetPopularPosts();

    return (
        <>
            <div className="relative px-2 xs:px-0 xs:w-[340px] sm:w-[530px] left-2/4 -translate-x-2/4 lg:-translate-x-3/4">
                {/* Post Listing */}
                <div className="flex flex-col gap-16">
                    {postData?.data && postData?.data?.length > 0 && postData.data.map((post: Post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
                <div className="h-40 w-full text-muted-foreground flex flex-row justify-center items-center gap-2">
                    <Icon name="octagon-x" className="" />
                    <p>No more posts available.</p>
                </div>
            </div>
        </>
    );

}

export default Home;