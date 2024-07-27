import { CalendarDays } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { User, UserInfo } from "@/types"
import Icon from "../Icon/Icon"
import { convertDateToReadableDate } from "@/utils/convertDateFormat"
import { useEffect, useState } from "react"
import { useGetUserByUserId, useGetUserInfoByUserId } from "@/hooks"
import { ScrollArea } from "../ui/scroll-area"
import { renderBioWithLinksAndBreaks } from "@/pages/Profile/Profile"
import { Badge } from "../ui/badge"
import { calculateAge } from "@/utils/formatDate"

export function UserInfoCard({ trigger, userId }: { trigger: React.ReactNode, userId: number }) {

    const [isOpenHoverCard, setIsOpenHoverCard] = useState(false);
    const { data: userData } = useGetUserByUserId(userId, isOpenHoverCard);
    const { data: userInfoData } = useGetUserInfoByUserId(userId, isOpenHoverCard);

    const UserInfoCard = () => {
        return (
            <div className="flex flex-row gap-2">
                <Avatar className={`w-9 h-9`}>
                    <AvatarImage src={userData?.data?.avatar_url} />
                    <AvatarFallback className="">
                        <Icon name="user-round" className={`text-slate-500 font-light`} />
                    </AvatarFallback>
                </Avatar>
                <div className="grow">
                    <h4 className="text-sm font-semibold">{userData?.data?.username}</h4>
                    <ScrollArea className={`h-10 text-sm ${userInfoData?.data?.bio ? "" : "text-muted-foreground"}`}>
                        {userInfoData?.data?.bio ?
                            <div dangerouslySetInnerHTML={renderBioWithLinksAndBreaks(userInfoData?.data?.bio)} />
                            :
                            "No Bio Available"
                        }
                    </ScrollArea>

                    {/* Other Information */}
                    <div className="flex flex-row gap-1 py-1">
                        {userInfoData?.data?.gender ? <Badge>{userInfoData?.data?.gender}</Badge> : null}
                        {userInfoData?.data?.birthday ? <Badge>Age: {calculateAge(userInfoData?.data?.birthday)}</Badge> : null}
                    </div>

                    {/* Joined Date */}
                    <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                            Joined {userData?.data?.created_at ? convertDateToReadableDate(userData?.data?.created_at) : "Unknown"}
                        </span>
                    </div>

                </div>
            </div >
        );
    }

    return (
        <HoverCard open={isOpenHoverCard} onOpenChange={setIsOpenHoverCard}>
            <HoverCardTrigger>
                {trigger}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                {userData && userInfoData && <UserInfoCard />}
                {!(userData && userInfoData) && (
                    <p className="text-bold">ERROR FETCHING</p>
                )}
            </HoverCardContent>
        </HoverCard>
    )
}
