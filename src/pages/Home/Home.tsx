import PostItem from "@/components/PostItem/PostItem";
import { Post } from "@/types";
import { useGetPopularPosts, useGetPopularPostsInfinite } from "@/hooks";
import Icon from "@/components/Icon/Icon";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";


const Home = () => {

    const [isNoRecordFound, setIsNoRecordFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lastPostRef = useRef<HTMLDivElement | null>(null);
    const [isError, setIsError] = useState(false);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });
    const popularPostsResult = useGetPopularPostsInfinite({
        enabled: true || !isLoading || !isError,
    });

    useEffect(() => {
        setIsNoRecordFound(
            popularPostsResult?.isSuccess && popularPostsResult?.data?.pages[0]?.data?.length === 0
        );

        setIsLoading(
            popularPostsResult?.isFetchingNextPage
        );

        if (popularPostsResult?.isError) {
            setIsError(true);
        }

    }, [popularPostsResult]);



    const handleLoadMore = () => {
        if (popularPostsResult.isFetchingNextPage) return;
        if (popularPostsResult?.hasNextPage === false) return;
        if (isError) return;

        popularPostsResult.fetchNextPage({ cancelRefetch: true });
    }

    if (entry?.isIntersecting) {
        handleLoadMore();
    }

    const popularPostsList = popularPostsResult.data.pages.flatMap((page) => page.data);

    return (
        <>
            <div className="relative px-2 xs:px-0 xs:w-[340px] sm:w-[530px] left-2/4 -translate-x-2/4 lg:-translate-x-3/4">
                {/* Post Listing */}
                <div className="flex flex-col gap-16">
                    {popularPostsList.map((post: Post, index) => (
                        <PostItem
                            ref={index === popularPostsList.length - 1 ? ref : null}
                            key={post.id}
                            post={post}
                        />
                    ))}
                </div>
                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Icon name="loader-circle" className="animate-spin text-muted-foreground" />
                    </div>
                )}
                {isNoRecordFound
                    && <p className="text-center text-muted-foreground">No Post found</p>
                }

                {isError &&
                    <div className="h-40 w-full text-muted-foreground flex flex-row justify-center items-center gap-2">
                        <Icon name="octagon-x" className="" />
                        <p>No more posts available.</p>
                    </div>
                }
            </div>
        </>
    );

}

export default Home;