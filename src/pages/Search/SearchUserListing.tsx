import Icon from "@/components/Icon/Icon";
import { PaginationComponent } from "./Pagination";
import { useEffect, useRef, useState } from "react";
import { User } from "@/types";
import { useGetSearchUsers } from "@/hooks";
import { renderBioWithLinksAndBreaks } from "@/pages/Profile/Profile"
import { calculateAge } from "@/utils/formatDate"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays } from "lucide-react";
import { convertDateToReadableDate } from "@/utils/convertDateFormat";
import { Card } from "@/components/ui/card";

type SearchUserListingProps = {
    searchValue: string;
}

const SearchUserListing: React.FC<SearchUserListingProps> = ({ searchValue }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [userList, setUserList] = useState<User[]>([]);
    const userListingRef = useRef<HTMLDivElement>(null);
    const { data: userResult, isLoading, isError } = useGetSearchUsers({
        searchValue,
        page: currentPage,
        enabled: !!searchValue
    });

    useEffect(() => {
        console.log(userResult);
        if (userResult?.data) {
            setUserList(userResult.data.data);
        }
    }, [userResult]);

    useEffect(() => {
        // when User clicks on pagination, scroll to top
        userListingRef.current?.firstElementChild?.scrollIntoView({ behavior: 'smooth' });
    }, [currentPage]);

    const handleJumpToProfile = (userId: number) => {
        location.href = `/profile/${userId}`;
    }

    return (
        <>
            {/* User Listing */}
            <div className="flex flex-col gap-10" ref={userListingRef}>
                {userList?.map((user: User, index) => (
                    <Card className="flex flex-row gap-2 p-2" onClick={() => handleJumpToProfile(user.id)}>
                        <Avatar className={`w-9 h-9`}>
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback className="">
                                <Icon name="user-round" className={`text-slate-500 font-light`} />
                            </AvatarFallback>
                        </Avatar>
                        <div className="grow">
                            <h4 className="text-sm font-semibold">{user?.username}</h4>
                            <ScrollArea className={`text-sm h-10 ${user?.userInfo?.bio ? "" : "text-muted-foreground"}`}>
                                {user?.userInfo?.bio ?
                                    <div dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(user?.userInfo?.bio)} />
                                    :
                                    "No Bio Available"
                                }
                            </ScrollArea>

                            {/* Other Information */}
                            <div className="flex flex-row gap-1 py-1">
                                {user?.userInfo?.gender ? <Badge>{user?.userInfo?.gender}</Badge> : null}
                                {user?.userInfo?.birthday ? <Badge>Age: {calculateAge(user?.userInfo?.birthday)}</Badge> : null}
                            </div>

                            {/* Joined Date */}
                            <div className="flex items-center pt-2">
                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                    Joined {user?.created_at ? convertDateToReadableDate(user?.created_at) : "Unknown"}
                                </span>
                            </div>

                        </div>
                    </Card>
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

            {userList?.length === 0 && searchValue
                && <p className="text-center text-muted-foreground">No User found</p>
            }

            {isError &&
                <div className="h-40 w-full text-muted-foreground flex flex-row justify-center items-center gap-2">
                    <Icon name="octagon-x" className="" />
                    <p>No more Users available.</p>
                </div>
            }

            {userResult && userResult?.data?.total > 0 &&
                <div className="mt-6">
                    <PaginationComponent
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalData={userResult?.data.total || 0}
                        limit={userResult?.data.limit || 0}
                    />
                </div>
            }
        </>
    );
}

export default SearchUserListing;