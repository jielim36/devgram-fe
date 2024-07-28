import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "@/style/color.css"
import Icon from "../Icon/Icon";
import { UserInfoCard } from "./UserInfoCard";

type AvatarContainerProps = {
    userId?: number;
    avatar_url?: string;
    hasStory: boolean;
    className?: string;
    avatarClassName?: string;
    boldBorder?: boolean;
    fallbackStrokeWidth?: number;
    fallbackClassName?: string;
    disableHoverInfoCard?: boolean;
}

const AvatarContainer: React.FC<AvatarContainerProps> = ({
    avatar_url,
    hasStory,
    className,
    avatarClassName,
    boldBorder = false,
    userId,
    fallbackStrokeWidth = 2,
    fallbackClassName,
    disableHoverInfoCard = false
}) => {

    const padding = boldBorder ? "p-[4px]" : "p-[2px]";
    const childPadding = boldBorder ? "p-[2px]" : "p-[1px]";
    const userProfilePath = `/profile/${userId}`;

    const handleAvatarClick = () => {
        if (hasStory) {
            // pop up story
        } else if (userId) {
            window.location.href = userProfilePath;
        }
    }

    const UserAvatarContainer = () => {
        return (
            <div
                className={`${hasStory ? "bg-gradient-2" : ""} ${padding} rounded-full cursor-pointer ${className}`}
                onClick={handleAvatarClick}
            >
                <div className={`rounded-full ${childPadding} card-color h-fit`}>
                    <Avatar className={`w-9 h-9 ${avatarClassName}`}>
                        <AvatarImage src={avatar_url} />
                        <AvatarFallback className="">
                            <Icon name="user-round" className={`text-slate-500 font-light ${fallbackClassName}`} strokeWidth={fallbackStrokeWidth} />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        );
    }

    if (!userId || disableHoverInfoCard) {
        return <UserAvatarContainer />;
    }

    return (
        <UserInfoCard trigger={<UserAvatarContainer />} userId={userId} />
    );
}

export default AvatarContainer;