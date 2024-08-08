import { Post } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useGetSearchPosts } from "@/hooks";
import { PaginationComponent } from "./Pagination";
import PostItem from "@/components/PostItem/PostItem";
import Icon from "@/components/Icon/Icon";

type SearchPostListingProps = {
    searchValue: string;
}

const SearchPostListing: React.FC<SearchPostListingProps> = ({ searchValue }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [postList, setPostList] = useState<Post[]>([]);
    const postListingRef = useRef<HTMLDivElement>(null);
    const { data: postResult, isLoading, isError } = useGetSearchPosts({
        searchValue,
        page: currentPage,
        enabled: !!searchValue
    });

    useEffect(() => {
        if (postResult?.data) {
            setPostList(postResult.data.data);
        }
    }, [postResult]);

    useEffect(() => {
        // when user clicks on pagination, scroll to top
        postListingRef.current?.firstElementChild?.scrollIntoView({ behavior: 'smooth' });
    }, [currentPage]);

    return (
        <>
            {/* Post Listing */}
            <div className="flex flex-col gap-16" ref={postListingRef}>
                {postList?.map((post: Post, index) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        highlight={searchValue}
                    />
                ))}
            </div>
            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <Icon name="loader-circle" className="animate-spin text-muted-foreground" />
                </div>
            )}

            {!searchValue &&
                <div className="py-10 w-full text-muted-foreground opacity-30 flex flex-col justify-center items-center gap-2">
                    <Icon name="search" className="" width={100} height={100} strokeWidth={2.5} />
                    <p className="font-bold text-xl">Search</p>
                </div>
            }

            {postList?.length === 0 && searchValue && !isError
                && <p className="text-center text-muted-foreground">No Post found</p>
            }

            {isError &&
                <div className="h-40 w-full text-muted-foreground flex flex-row justify-center items-center gap-2">
                    <Icon name="octagon-x" className="" />
                    <p>No more posts available.</p>
                </div>
            }

            {postResult && postResult?.data?.total > 0 &&
                <div className="mt-6">
                    <PaginationComponent
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalData={postResult?.data.total || 0}
                        limit={postResult?.data.limit || 0}
                    />
                </div>
            }
        </>
    );
}

export default SearchPostListing;